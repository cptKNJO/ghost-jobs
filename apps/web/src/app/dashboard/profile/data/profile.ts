import "server-only";

import { db, eq } from "@repo/db";
import { profiles } from "@repo/db/schema";
import { getUser } from "@/app/lib/dal/auth";

// TODO: This should probably lead to the login page
export async function getProfile() {
  const user = await getUser();
  if (!user) return null;

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
