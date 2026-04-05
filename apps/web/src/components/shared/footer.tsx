import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-6">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} JobTracker. Built for modern engineers.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/terms"
            className="text-sm font-medium underline underline-offset-4"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm font-medium underline underline-offset-4"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
