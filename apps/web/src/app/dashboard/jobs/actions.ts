"use server";

import { revalidatePath } from "next/cache";
import {
  createJobPost,
  createCompany,
  getJobPosts,
  getLookupData,
  deleteJobPost,
  editJobPost,
  getJobPostById,
} from "./data/job-posts";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { companySchema, jobPostSchema } from "./utils/schema";
// Custom error
import "../../lib/zod";
import { idSchema } from "../../lib/zod";

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

export async function getJobPostByIdAction(id: string) {
  const result = idSchema.safeParse(id);

  if (!result.success) {
    console.log(result.error!.issues);
    return { error: result.error!.issues };
  }

  return await getJobPostById(result.data);
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

export async function editJobPostAction(
  id: number,
  prevState: any,
  formData: FormData | null,
) {
  // Handle reset
  if (formData === null) {
    return { success: null, error: null };
  }

  try {
    const validated = await serverValidateJobPost(formData);

    await editJobPost(id, validated);

    // TODO: This should appear on top of the edit page
    // FIXME: Still not causing the page to close
    revalidatePath(`/jobs/${id}`);
    return {
      success: true,
      message: {
        title: "Successfully updated!",
        text: "Add another job post or close the form.",
      },
    };
  } catch (error) {
    console.log(error);

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
