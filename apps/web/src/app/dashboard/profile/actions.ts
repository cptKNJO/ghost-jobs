"use server";

import { getProfile } from "@/app/data/profile";

export async function getProfileAction() {
  return await getProfile();
}
