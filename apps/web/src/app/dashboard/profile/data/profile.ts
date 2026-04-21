import "server-only";

import { db, eq } from "@repo/db";
import { profiles } from "@repo/db/schema";
import { getUser } from "@/app/lib/dal/auth";
import { profileSchema, type ProfileSchema } from "../utils/schema";

export async function getProfile() {
  const user = await getUser();

  // Isn't really triggered, proxy.ts seems to be catching everything
  // sensitive behind login
  if (!user) {
    return { error: "Unauthorized", status: 401 };
  }

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
    });

    return profile ?? null;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function updateProfile(data: ProfileSchema) {
  const user = await getUser();
  if (!user) return null;

  const cleaned = profileSchema.parse(data);

  try {
    const [updated] = await db
      .update(profiles)
      .set(cleaned)
      .where(eq(profiles.userId, user.id))
      .returning();

    return updated;
  } catch (error) {
    throw Error("Failed to update the profile", { cause: error });
  }
}
