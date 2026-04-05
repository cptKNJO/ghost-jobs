"use client";

import Link from "next/link";

import { Button } from "@repo/ui/components/button";

// const NAV_LINKS = [
// { href: "#pricing", label: "Pricing" }
// ];

export function Navbar() {
  return (
    <header className="w-full bg-background/95">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="w-full flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">
              JobTracker
            </span>
          </Link>

          {/*<NavigationMenu className="flex">
            <NavigationMenuList>
              {NAV_LINKS.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent",
                      )}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>*/}

          <div className="ml-auto flex items-center gap-4">
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
