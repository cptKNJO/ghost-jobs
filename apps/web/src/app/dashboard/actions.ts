"use server";

// FIXME: Shouldn't be importing anything with db here...
import { revalidatePath } from "next/cache";
import { db } from "@repo/db";
import { jobPost } from "@repo/db/schema";
import {
  createJobPost,
  getJobPosts,
  getLookupData,
} from "@/app/data/job-posts";
import { getProfile } from "@/app/data/profile";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { jobPostSchema } from "./utils/schema";
// Custom error
import "../lib/zod";

function cleanFormData(formData: FormData) {
  const rawData = Object.fromEntries(formData);

  // 1. Clean the data
  const cleanData = Object.fromEntries(
    Object.entries(rawData).map(([key, value]) => {
      if (typeof value !== "string") return [key, value];

      const trimmed = value.trim();
      // Convert empty strings to null for the DB
      return [key, trimmed === "" ? null : trimmed];
    }),
  );

  const cleanFormData = new FormData();

  Object.entries(cleanData).forEach(([key, value]) => {
    // FormData doesn't support null/undefined natively.
    // We check if the value exists before appending.
    if (value !== null && value !== undefined) {
      cleanFormData.append(key, value as string | Blob);
    } else {
      // If you want to keep the key but have it empty:
      cleanFormData.append(key, "");
    }
  });

  return cleanFormData;
}

const serverValidate = createServerValidate({
  // TODO: Isn't this supposed to be jobPostOptions?
  ...formOptions,
  onServerValidate: jobPostSchema,
});

export async function getJobPostsAction() {
  return await getJobPosts();
}

export async function getLookupDataAction() {
  return await getLookupData();
}

export async function createJobPostAction(prev: unknown, formData: FormData) {
  try {
    // FIXME: Must ensure non-trimmed input not there here
    const validated = await serverValidate(cleanFormData(formData));

    const profile = await getProfile();
    if (!profile) {
      return { error: "Profile not found" };
    }

    await createJobPost(validated);

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    console.error("Failed to create job post:", error);
    return { error: "Database error" };
  }
}

// FIXME: no db imports directly here
export async function deleteJobPostAction(id: number) {
  const profile = await getProfile();
  if (!profile) return { error: "Unauthorized" };

  try {
    // Drizzle doesn't easily support multi-condition delete in the simple syntax,
    // we use standard eq(jobPost.id, id) but we should ideally verify ownership.
    // Given profileId is on the table, we can use and() from drizzle-orm.
    const { eq, and } = await import("@repo/db");

    await db
      .delete(jobPost)
      .where(and(eq(jobPost.id, id), eq(jobPost.profileId, profile.id)));

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete job post:", error);
    return { error: "Database error" };
  }
}
