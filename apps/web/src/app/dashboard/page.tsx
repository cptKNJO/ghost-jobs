import { getUser } from "@/app/lib/dal/auth";
import { redirect } from "next/navigation";
import { getProfileAction } from "./profile/actions";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfileAction();

  return <div>You are logged in, {profile.displayName}!</div>;
}
