"use server";

import { revalidatePath } from "next/cache";
import { db } from "@repo/db";
import { jobPost } from "@repo/db/schema";
import { getJobPosts, getLookupData } from "@/app/data/job-posts";
import { getProfile } from "@/app/data/profile";
import { z } from "zod";

const jobPostSchema = z.object({
  role: z.string().min(1, "Role is required"),
  linkToPost: z.string().url("Must be a valid URL"),
  companyId: z.coerce.number().optional(),
  sourceId: z.coerce.number().optional(),
  statusId: z.coerce.number().min(1, "Status is required"),
  appliedOn: z.string().optional(),
});

export async function getJobPostsAction() {
  return await getJobPosts();
}

export async function getLookupDataAction() {
  return await getLookupData();
}

export async function createJobPostAction(formData: FormData) {
  const profile = await getProfile();
  if (!profile) {
    return { error: "Profile not found" };
  }

  const rawData = {
    role: formData.get("role"),
    linkToPost: formData.get("linkToPost"),
    companyId: formData.get("companyId"),
    sourceId: formData.get("sourceId"),
    statusId: formData.get("statusId"),
    appliedOn: formData.get("appliedOn") || undefined,
  };

  const validated = jobPostSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors };
  }

  try {
    await db.insert(jobPost).values({
      ...validated.data,
      profileId: profile.id,
      appliedOn: validated.data.appliedOn ? new Date(validated.data.appliedOn) : new Date(),
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create job post:", error);
    return { error: "Database error" };
  }
}

export async function deleteJobPostAction(id: number) {
  const profile = await getProfile();
  if (!profile) return { error: "Unauthorized" };

  try {
    // Drizzle doesn't easily support multi-condition delete in the simple syntax,
    // we use standard eq(jobPost.id, id) but we should ideally verify ownership.
    // Given profileId is on the table, we can use and() from drizzle-orm.
    const { eq, and } = await import("@repo/db");

    await db.delete(jobPost).where(
      and(
        eq(jobPost.id, id),
        eq(jobPost.profileId, profile.id)
      )
    );

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job post:", error);
    return { error: "Database error" };
  }
}
