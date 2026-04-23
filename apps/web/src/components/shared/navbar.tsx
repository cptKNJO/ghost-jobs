import { getUser } from "@/app/lib/dal/auth";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "../mode-toggle";
import { config } from "../../../config";
import { Icon } from "@repo/ui/components/ui/icon";

export async function Navbar() {
  const user = await getUser();

  return (
    <header className="w-full bg-background border-b border-b-border">
      <div className="container flex sm:h-16 items-center justify-between mx-auto px-4">
        <div className="w-full flex flex-wrap items-center gap-6 py-4 sm:py-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">
              {config.title}
            </span>
            <div className="flex gap-1 ml-2 text-sm text-muted-foreground">
              It&apos;s spooky out there
              <Icon name="ghost" />
            </div>
          </Link>

          <div className="-ml-2 sm:ml-auto flex items-center gap-4">
            <ModeToggle />
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
          </div>
        </div>
      </div>
    </header>
  );
}
