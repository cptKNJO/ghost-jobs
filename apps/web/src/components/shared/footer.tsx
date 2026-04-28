import { config } from "@/config";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-2">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
        <p className="text-sm leading-loose text-muted-foreground text-left">
          &copy; {new Date().getFullYear()} {config.title}.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Pricing
          </Link>
          <Link
            href="/legal/terms-and-conditions"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms
          </Link>
          <Link
            href="/legal/privacy-policy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/legal/refund-policy"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Refunds
          </Link>
        </div>
      </div>
    </footer>
  );
}
