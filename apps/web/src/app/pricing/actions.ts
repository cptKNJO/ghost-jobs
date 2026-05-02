"use server";

import { billing } from "@repo/billing";
import { getProfileAction } from "../dashboard/profile/actions";
import { redirect } from "next/navigation";
import { idSchema } from "../lib/zod";
import {
  getPricingPlanById,
  getPricingPlans,
  createSubscription,
} from "./data/pricing";
import { revalidatePath } from "next/cache";

export async function createSubscriptionAction(data: any) {
  try {
    const result = await createSubscription(data);
    if (!result) return { error: "User profile not found." };

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update subscription status." };
  }
}

export async function createCheckoutAction(formData: FormData) {
  const profile = await getProfileAction();

  if (!profile || "error" in profile) {
    redirect("/login");
  }

  const planId = formData.get("planId") as string;
  const plan = await getPlanByIdAction(planId);
  if (!plan) {
    throw new Error("Plan not found");
  }

  // Handle free tier (could just redirect to dashboard if they are logged in)
  if (plan.name.toLowerCase() === "free") {
    redirect("/dashboard");
  }

  try {
    const { id, externalCustomerId, email } = profile;

    const exists = await billing.checkIfAlreadyExists(profile.id);

    if (exists) {
      redirect(exists);
    }

    const checkoutUrl = await billing.checkout(
      {
        id,
        externalCustomerId,
        // We will always have an email in this case
        email: email!,
      },
      plan,
    );

    redirect(checkoutUrl);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Checkout error:", error);
    throw new Error("Failed to create checkout session");
  }
}

export async function getPlanByIdAction(id: string) {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    return null;
  }

  return await getPricingPlanById(result.data);
}

export async function getPricingPlansAction() {
  return await getPricingPlans();
}
