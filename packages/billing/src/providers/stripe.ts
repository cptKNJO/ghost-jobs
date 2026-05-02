import Stripe from "stripe";
import {
  pricingPlans,
  profiles,
  ProfileWithEmail,
  type PricingPlan,
} from "@repo/db/schema";
import { db, eq } from "@repo/db";
import { subscriptions } from "@repo/db/schema";

export class StripeProvider {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: "2025-02-24.acacia",
    });
  }

  /**
   * Generates a checkout URL for the hybrid "Human/Robot" model
   */
  async createCheckout(
    profile: ProfileWithEmail,
    plan: PricingPlan,
    redirectUrls: { success: string; cancel: string },
  ): Promise<string> {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    if (plan.providerPriceBaseId) {
      line_items.push({
        price: plan.providerPriceBaseId,
        quantity: 1,
      });
    }

    if (plan.providerPriceMeteredId) {
      line_items.push({
        price: plan.providerPriceMeteredId,
      });
    }

    if (line_items.length === 0) {
      throw new Error("Plan has no stripe price IDs configured");
    }

    const session = await this.stripe.checkout.sessions.create({
      ...(profile.externalCustomerId && {
        customer: profile.externalCustomerId,
      }),
      ...(profile.email && { customer_email: profile.email }),
      mode: "subscription",
      line_items,
      subscription_data: {
        trial_period_days: 7, // Default from PRICING.md, could be moved to schema
      },
      client_reference_id: profile.id.toString(),
      success_url: redirectUrls.success,
      cancel_url: redirectUrls.cancel,
    });

    if (!session.url) throw new Error("Stripe session creation failed");

    return session.url;
  }

  /**
   * Retrieves a checkout session and expands the subscription object
   */
  async getSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription.items.data.price"], // Crucial for getting metered IDs
    });
  }

  /**
   * Sync subscription data from Stripe to local db and update usage count
   */
  async syncSubscription(
    stripeSubscription: Stripe.Subscription,
    profileId: number, // Passed from client_reference_id or metadata
  ) {
    // 1. Fetch the Internal Plan ID using the Stripe Price ID
    // This assumes your pricingPlans table stores the stripe price id
    const priceId = stripeSubscription.items.data[0].price.id;
    const plan = await db.query.pricingPlans.findFirst({
      where: eq(pricingPlans.providerPriceBaseId, priceId),
    });

    if (!plan) {
      throw new Error(`Plan not found for price ${priceId}`);
    }

    // 2. Identify the Metered Item ID (the si_... ID)
    const meteredItem = stripeSubscription.items.data.find(
      (item) =>
        item.price.billing_scheme === "per_unit" &&
        item.price.recurring?.usage_type === "metered",
    );

    try {
      return await db.transaction(async (tx) => {
        // Step A: Update Profile
        // We do this first to ensure the FK constraint in step B is satisfied
        await tx
          .update(profiles)
          .set({ externalCustomerId: stripeSubscription.customer as string })
          .where(eq(profiles.id, profileId));

        // Calculate the reset logic in JavaScript
        // We fetch the existing subscription first to compare dates
        const [existingSub] = await tx
          .select()
          .from(subscriptions)
          .where(
            eq(subscriptions.externalSubscriptionId, stripeSubscription.id),
          )
          .limit(1);

        // Logic: If the incoming start date is newer than what we have, reset to 0
        const shouldResetUsage = existingSub
          ? new Date(stripeSubscription.current_period_start * 1000).getTime() >
            existingSub.currentPeriodStart!.getTime()
          : false;

        const subValues = {
          profileId,
          planId: plan.id,
          externalSubscriptionId: stripeSubscription.id,
          externalPriceItemId: meteredItem?.id ?? null,
          status: stripeSubscription.status,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          currentPeriodStart: new Date(
            stripeSubscription.current_period_start * 1000,
          ),
          currentPeriodEnd: new Date(
            stripeSubscription.current_period_end * 1000,
          ),
          // Don't forget these!
          trialStart: stripeSubscription.trial_start
            ? new Date(stripeSubscription.trial_start * 1000)
            : null,
          trialEnd: stripeSubscription.trial_end
            ? new Date(stripeSubscription.trial_end * 1000)
            : null,
          usageCount: shouldResetUsage ? 0 : (existingSub?.usageCount ?? 0),
        };

        // Step B: Upsert Subscription
        // Using a 'conflict' check is often cleaner in Postgres/Supabase
        await tx.insert(subscriptions).values(subValues).onConflictDoUpdate({
          target: subscriptions.externalSubscriptionId,
          set: subValues,
        });

        return { success: true };
      });
    } catch (error) {
      console.error("Billing Sync Failed. Transaction Rolled Back.", error);
      throw error;
    }
  }
}
