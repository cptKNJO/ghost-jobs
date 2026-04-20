import "server-only";

import { db, eq } from "@repo/db";
import { profiles } from "@repo/db/schema";
import { getUser } from "@/app/lib/dal/auth";

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
