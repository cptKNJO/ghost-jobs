"use server";

// FIXME: Shouldn't be importing anything with db here...
import { revalidatePath } from "next/cache";
import { db } from "@repo/db";
import { jobPost } from "@repo/db/schema";
import {
  createJobPost,
  createCompany,
  getJobPosts,
  getLookupData,
} from "@/app/data/job-posts";
import { getProfile } from "@/app/data/profile";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { companySchema, jobPostSchema } from "./utils/schema";
// Custom error
import "../lib/zod";

const serverValidateJobPost = createServerValidate({
  ...formOptions,
  onServerValidate: jobPostSchema,
});

const serverValidateCompany = createServerValidate({
  ...formOptions,
  onServerValidate: companySchema,
});

export async function getJobPostsAction() {
  return await getJobPosts();
}

export async function getLookupDataAction() {
  return await getLookupData();
}

export async function createCompanyAction(
  prev: unknown,
  formData: FormData | null,
) {
  try {
    const validated = await serverValidateCompany(formData);

    await createCompany(validated);

    revalidatePath("/dashboard");
    return {
      success: true,
      message: {
        title: "Successfully saved!",
        text: "Company has been added.",
      },
    };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    if (error?.cause?.message.includes("unique constraint")) {
      return {
        error: true,
        message: "This company already exists.",
      };
    }

    return {
      error: true,
      message: "Failed to save the company, try again later.",
    };
  }
}

export async function createJobPostAction(
  prev: unknown,
  formData: FormData | null,
) {
  // Handle reset
  if (formData === null) {
    revalidatePath("/dashboard");
    return { success: null, error: null };
  }

  try {
    const validated = await serverValidateJobPost(formData);

    await createJobPost(validated);

    return {
      success: true,
      message: {
        title: "Successfully saved!",
        text: "Add another job post or close the form.",
      },
    };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    return {
      error: true,
      message: "Failed to save the form, try again later.",
    };
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
