// src/app/login/actions.ts
"use server";
import { createClient } from "@/utils/supabase/server";
import { generateUniqueDisplayName } from "@/utils/display-name";

export async function signInWithMagicLink(formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const displayName = generateUniqueDisplayName();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: { display_name: displayName },
    },
  });

  if (error) {
    console.error(error.message);
    return { error: "Failed to login, try again later", success: false };
  }

  return { error: null, success: true };
}
