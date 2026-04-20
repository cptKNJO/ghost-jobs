"use server";

import { revalidatePath } from "next/cache";
import {
  createJobPost,
  createCompany,
  getJobPosts,
  getLookupData,
  deleteJobPost,
} from "./data/job-posts";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { companySchema, jobPostSchema } from "./utils/schema";
// Custom error
import "../../lib/zod";

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
  if (formData === null) {
    revalidatePath("/dashboard");
    return { success: null, error: null };
  }

  try {
    // TODO: why isn't this revalidating and closing the form?
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
    console.log("sad", error);
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

export async function deleteJobPostAction(id: number) {
  try {
    await deleteJobPost(id);

    revalidatePath("/dashboard");
    return {
      success: true,
      message: {
        title: "Deleted!",
        text: "The job application has been removed.",
      },
    };
  } catch (error) {
    console.error("Failed to delete job post:", error);
    return {
      error: true,
      message: "Failed to delete the application, please try again.",
    };
  }
}
