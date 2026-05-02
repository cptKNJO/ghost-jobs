"use server";

import { revalidatePath } from "next/cache";
import { getProfile, updateProfile } from "./data/profile";
import {
  createServerValidate,
  formOptions,
  ServerValidateError,
} from "@tanstack/react-form-nextjs";
import { profileSchema } from "./utils/schema";

const serverValidateProfile = createServerValidate({
  ...formOptions,
  onServerValidate: profileSchema,
});

export async function getProfileAction() {
  return await getProfile();
}

export async function updateProfileAction(
  prev: unknown,
  formData: FormData | null,
) {
  if (formData === null) {
    // revalidatePath("/dashboard/profile");
    return { success: null, error: null };
  }

  try {
    const validated = await serverValidateProfile(formData);

    await updateProfile(validated);

    revalidatePath("/dashboard/profile");
    return {
      success: true,
      message: {
        title: "Profile updated!",
        text: "Your information has been saved.",
      },
    };
  } catch (error) {
    if (error instanceof ServerValidateError) {
      return error.formState;
    }

    if (error?.cause?.message.includes("unique constraint")) {
      return {
        error: true,
        message: "This display name is already taken.",
      };
    }

    return {
      error: true,
      message: "Failed to update profile, try again later.",
    };
  }
}
