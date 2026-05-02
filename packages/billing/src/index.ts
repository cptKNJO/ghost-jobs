import { ProfileWithEmail, type PricingPlan } from "@repo/db/schema";
import { StripeProvider } from "./providers/stripe";
import Stripe from "stripe";

const provider = new StripeProvider(process.env.STRIPE_SECRET_KEY!);

export const billing = {
  // We wrap the provider method to make the arguments even simpler
  checkout: async (profile: ProfileWithEmail, plan: PricingPlan) => {
    return provider.createCheckout(profile, plan, {
      success: `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    });
  },

  verifyAndSync: async (sessionId: string, expectedProfileId: number) => {
    const session = await provider.getSession(sessionId);

    if (
      !session.client_reference_id ||
      session.client_reference_id !== expectedProfileId.toString()
    ) {
      throw new Error("User mismatch");
    }

    if (session.status !== "complete") {
      throw new Error("Session not complete");
    }

    // Pass the expanded subscription object to your sync logic
    return await provider.syncSubscription(
      session.subscription as Stripe.Subscription,
      expectedProfileId,
    );
  },

  // TODO: Is this used elsewhere out of billing?
  getSession: async (sessionId: string) => {
    return provider.getSession(sessionId);
  },

  reportUsage: async (
    profileId: number,
    customerId: string,
    incrementBy: number = 1,
  ) => {
    return provider.reportUsage(profileId, customerId, incrementBy);
  },
};
