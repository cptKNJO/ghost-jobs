"use server";

import { revalidatePath } from "next/cache";
import { db } from "@repo/db";
import { jobPost, insertJobPostSchema } from "@repo/db/schema";
import { getJobPosts, getLookupData } from "@/app/data/job-posts";
import { getProfile } from "@/app/data/profile";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { z } from "zod";
import "../lib/zod";

// const jobPostSchema = z.object({
//   role: z.string().min(3, "Role is required"),
//   linkToPost: z.url("Must be a valid URL"),
//   companyId: z.coerce.number().optional(),
//   sourceId: z.coerce.number().optional(),
//   statusId: z.coerce.number().min(1, "Status is required"),
//   appliedOn: z.string().optional(),
// });
const jobPostSchema = insertJobPostSchema.extend({
  role: z.string().min(1, "Enter a role or job title"),
  linkToPost: z.url("Enter a link to the job post"),

  // // Label: "Company"
  // companyId: z.string().min(1, "Select a company"),

  // // Label: "Status"
  // statusId: z.string().min(1, "Select a status"),
});

const serverValidate = createServerValidate({
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
  console.log(formData);
  try {
    const validated = await serverValidate(formData);
    // console.log("validatedData", validated);

    const profile = await getProfile();
    if (!profile) {
      return { error: "Profile not found" };
    }

    // const rawData = {
    //   role: formData.get("role"),
    //   linkToPost: formData.get("linkToPost"),
    //   companyId: formData.get("companyId"),
    //   sourceId: formData.get("sourceId"),
    //   statusId: formData.get("statusId"),
    //   appliedOn: formData.get("appliedOn") || undefined,
    // };

    // try {
    // await db.insert(jobPost).values({
    //   ...validated.data,
    //   profileId: profile.id,
    //   appliedOn: validated.data.appliedOn
    //     ? new Date(validated.data.appliedOn)
    //     : new Date(),
    // });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      console.log("picket");
      // console.log(error.formState.errorMap.onServer);
      // console.log(error.formState.errors);
      // console.log(error.formState.errors[0].issues);
      return error.formState;
    }

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
