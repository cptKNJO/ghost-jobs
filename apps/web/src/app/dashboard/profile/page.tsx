import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { getProfileAction } from "./actions";

export default async function ProfilePage() {
  const profile = await getProfileAction();

  if (!profile || "error" in profile) {
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <p>Could not load profile. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Display Name
              </p>
              <p className="text-lg font-semibold">{profile.displayName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
