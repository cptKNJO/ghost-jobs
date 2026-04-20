// components/ui/app-link.tsx
import * as React from "react";
import Link, { LinkProps as NextLinkProps } from "next/link";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { LinkProps as BaseLinkProps } from "@repo/ui/components/ui/link";
import { cn } from "@repo/ui/lib/utils";

// We combine Next.js navigation logic with our BaseLink's style props
interface AppLinkProps extends NextLinkProps, Omit<BaseLinkProps, "href"> {
  children: React.ReactNode;
}

const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ className, variant = "link", size, href, ...props }, ref) => {
    return (
      <Link
        href={href}
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
AppLink.displayName = "AppLink";

export { AppLink };
