import "server-only";

import { db, eq } from "@repo/db";
import {
  pricingPlans,
  subscriptions,
  type NewSubscription,
} from "@repo/db/schema";
import { getProfile } from "../../dashboard/profile/data/profile";

export async function getPricingPlanById(id: number) {
  try {
    const plan = await db.query.pricingPlans.findFirst({
      where: eq(pricingPlans.id, id),
    });
    return plan ?? null;
  } catch (error) {
    console.error("Error fetching pricing plan:", error);
    return null;
  }
}

export async function createSubscription(
  data: Omit<NewSubscription, "profileId">,
) {
  const profile = await getProfile();
  if (!profile || "error" in profile) return null;

  try {
    const [inserted] = await db
      .insert(subscriptions)
      .values({
        ...data,
        profileId: profile.id,
      })
      .onConflictDoUpdate({
        target: subscriptions.profileId,
        set: data,
      })
      .returning();

    return inserted;
  } catch (error) {
    console.error("Failed to create/update subscription:", error);
    throw Error("Database operation failed while saving subscription.");
  }
}

export async function getPricingPlans() {
  try {
    const plans = await db.query.pricingPlans.findMany({
      orderBy: (companies, { asc }) => [asc(companies.amount)],
    });

    return plans;
  } catch (error) {
    console.error("Error fetching job posts:", error);
    return [];
  }
}
