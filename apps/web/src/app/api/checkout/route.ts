import { billing } from "@repo/billing";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getProfileAction } from "@/app/dashboard/profile/actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    redirect("/pricing");
  }

  try {
    const profile = await getProfileAction();
    if (!profile || "error" in profile) {
      redirect("/login");
    }

    await billing.verifyAndSync(sessionId, profile.id);

    redirect("/dashboard");
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error syncing subscription:", error);
    redirect("/pricing");
  }
}
