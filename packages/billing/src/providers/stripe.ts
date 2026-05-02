import Stripe from "stripe";
import {
  pricingPlans,
  profiles,
  ProfileWithEmail,
  type PricingPlan,
} from "@repo/db/schema";
import { and, db, desc, eq, inArray, isNull, sql } from "@repo/db";
import { subscriptions } from "@repo/db/schema";

const STRIPE = {
  EVENTS: {
    JOB_COMPLETED: "job_completed",
  },
};

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

    const baseSession: Stripe.Checkout.SessionCreateParams = {
      ...(profile.externalCustomerId && {
        customer: profile.externalCustomerId,
      }),
      mode: "subscription",
      line_items,
      subscription_data: {
        trial_period_days: 7, // Default from PRICING.md, could be moved to schema
      },
      client_reference_id: profile.id.toString(),
      success_url: redirectUrls.success,
      cancel_url: redirectUrls.cancel,
    };

    // add email if no customerId - can't add both in Stripe
    //
    if (profile.email && !baseSession.customer) {
      baseSession.customer_email = profile.email;
    }

    const session = await this.stripe.checkout.sessions.create(baseSession);

    if (!session.url) throw new Error("Stripe session creation failed");

    return session.url;
  }

  /**
   * Retrieves a checkout session and expands the subscription object
   */
  async getSession(sessionId: string) {
    return await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription.items.data"], // Crucial for getting metered IDs
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
        item.price.billing_scheme === "tiered" &&
        item.price.recurring?.usage_type === "metered",
    );

    try {
      return await db.transaction(async (tx) => {
        // Step A: Update Profile
        // We do this first to ensure the FK constraint in step B is satisfied
        const result = await tx
          .update(profiles)
          .set({ externalCustomerId: stripeSubscription.customer as string })
          .where(
            and(
              eq(profiles.id, profileId),
              isNull(profiles.externalCustomerId),
            ),
          );

        if (result.length > 0) {
          console.log("Customer ID linked for the first time.");
        }

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

        console.log(stripeSubscription);
        console.log(subValues);

        const { externalSubscriptionId, ...settableValues } = subValues;

        // Step B: Upsert Subscription
        // Using a 'conflict' check is often cleaner in Postgres/Supabase
        await tx.insert(subscriptions).values(subValues).onConflictDoUpdate({
          target: subscriptions.externalSubscriptionId,
          set: settableValues,
        });

        return { success: true };
      });
    } catch (error) {
      console.log(error.cause);
      console.error("Billing Sync Failed. Transaction Rolled Back.", error);
      throw error;
    }
  }

  async reportUsage(
    profileId: number,
    customerId: string,
    incrementBy: number = 1,
  ) {
    // 1. Fetch the external item ID from your DB
    const sub = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.profileId, profileId),
      columns: {
        externalPriceItemId: true,
        status: true,
      },
    });

    // Only report if they have an active metered plan
    if (!sub?.externalPriceItemId || sub.status !== "active") {
      console.log("No metered subscription found for user.");
      return;
    }

    try {
      // 2. Report to Stripe (The "Source of Truth" for money)
      // We use action: 'increment' so we don't have to keep track of total state here
      await this.stripe.billing.meterEvents.create({
        event_name: STRIPE.EVENTS.JOB_COMPLETED, // The meter's event name
        payload: {
          stripe_customer_id: customerId,
          value: incrementBy.toString(), // Usage amount as string
        },
      });

      // 3. Increment in your DB (The "Source of Truth" for your UI)
      // We use a transaction or an atomic SQL increment to prevent race conditions
      const [updatedSubscription] = await db
        .update(subscriptions)
        .set({
          usageCount: sql`${subscriptions.usageCount} + ${incrementBy}`,
        })
        .where(eq(subscriptions.profileId, profileId))
        .returning();

      return updatedSubscription;
    } catch (error) {
      console.error("Failed to report usage to Stripe:", error);
      // Logic choice: do you fail the job post if Stripe reporting fails?
      // Usually, you log this and retry later to avoid blocking the user.
      throw error;
    }
  }

  /**
   * check if user susbscription already exists
   */
  // TODO: Should we remove this - not using the existingSub path
  async checkIfAlreadySubscribed(profileId: number) {
    // 1. Check for existing active/trialing subscription
    const existingSub = await db.query.subscriptions.findFirst({
      where: (subs, { and, eq, or }) =>
        and(
          eq(subs.profileId, profileId),
          or(eq(subs.status, "active"), eq(subs.status, "trialing")),
        ),
    });

    // 2. If they have one, don't let them buy another
    if (existingSub) {
      // Optional: Fetch the Customer ID to send them to the Billing Portal
      const profile = await db.query.profiles.findFirst({
        where: (p, { eq }) => eq(p.id, profileId),
      });

      if (profile?.externalCustomerId) {
        const portalSession = await this.stripe.billingPortal.sessions.create({
          customer: profile.externalCustomerId,
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        });
        return portalSession.url;
      }

      throw new Error("You already have an active subscription.");
    }
    // TODO: Move as not happy path
    return null;
  }

  async handleWebhook(payload: string, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
      console.log("hooked", event.type);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      throw new Error("Webhook signature verification failed");
    }

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        // Retrieve profile from customerId
        const profile = await db.query.profiles.findFirst({
          where: eq(
            profiles.externalCustomerId,
            subscription.customer as string,
          ),
        });

        // Sync subscriptions
        if (profile?.id) {
          await this.syncSubscription(subscription, profile.id);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const plan = await db.query.pricingPlans.findFirst({
          where: eq(pricingPlans.name, "free"),
        });

        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            cancelAtPeriodEnd: false,
            planId: plan!.id, // set to free tier
          })
          .where(eq(subscriptions.externalSubscriptionId, subscription.id));
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  }

  async upgradeToRobot(profileId: number, newPlanId: string) {
    // 1. Get the LATEST active or trialing subscription
    const sub = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.profileId, profileId),
        inArray(subscriptions.status, ["active", "trialing"]),
      ),
      orderBy: [desc(subscriptions.createdAt)],
    });

    if (!sub || !sub.externalSubscriptionId) {
      throw new Error("No active subscription found to upgrade.");
    }

    // 3. Fetch full subscription from Stripe to get current Item IDs
    const stripSub = await this.stripe.subscriptions.retrieve(
      sub.externalSubscriptionId,
      {
        expand: ["items.data.price"],
      },
    );

    const plan = await db.query.pricingPlans.findFirst({
      where: eq(pricingPlans.id, +newPlanId),
    });

    // Build items array for update
    const itemsToUpdate = stripSub.items.data.map((item) => {
      const price = item.price;
      let newPriceId = plan?.providerPriceBaseId; // set default to base flat fee id

      // Determine item type
      if (price.recurring?.usage_type === "metered") {
        newPriceId = plan?.providerPriceMeteredId;
      }

      return {
        id: item.id,
        price: newPriceId,
        ...(price.billing_scheme === "tiered" && {
          // For tiered items, you might want to preserve quantity
          quantity: item.quantity,
        }),
      };
    });

    // 4. Update the subscription by swapping specific items
    // We use the 'price.id' to identify which item is the flat fee vs metered fee
    const updated = await this.stripe.subscriptions.update(
      sub.externalSubscriptionId,
      {
        items: itemsToUpdate,
        proration_behavior: "always_invoice",
      },
    );

    // Sync immediately
    await this.syncSubscription(updated, profileId);

    return { success: true };
  }
}
