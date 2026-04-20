"use server";

import { getProfile } from "./data/profile";

export async function getProfileAction() {
  return await getProfile();
}
