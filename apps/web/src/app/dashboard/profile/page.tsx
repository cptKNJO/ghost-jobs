import { getProfile } from "./data/profile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";
import { ProfileForm } from "./components/profile-form";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile || "error" in profile) {
    return (
      <div className="">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p>Could not load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Display Name</CardTitle>
          <CardDescription>
            This is your public display name. It must be between 3 and 50
            characters.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm defaultValues={{ displayName: profile.displayName }} />
        </CardContent>
      </Card>
    </div>
  );
}
