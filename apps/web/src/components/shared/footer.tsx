import { config } from "../../../config";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background py-2">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-16 flex-row md:py-0">
        <p className="text-sm leading-loose text-muted-foreground text-left">
          &copy; {new Date().getFullYear()} {config.title}.
        </p>
      </div>
    </footer>
  );
}
