// components/ui/-link.tsx
import * as React from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";

export interface LinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant = "link", size, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className }),
          variant === "link" && "px-0",
        )}
        {...props}
      />
    );
  },
);
Link.displayName = "Link";

export { Link };
