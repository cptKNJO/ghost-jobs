import { getUser } from "@/app/lib/dal/auth";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="w-full flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">
              JobTracker
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/dashboard/profile">
                  <Button variant="ghost">Profile</Button>
                </Link>
                <form action="/auth/signout" method="post">
                  <Button type="submit" variant="outline">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
