import Link from "next/link";

export function Navbar({ children }: { children: React.ReactNode }) {
  return (
    <header className="w-full bg-background/95">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <div className="w-full flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">
              JobTracker
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-4">{children}</div>
        </div>
      </div>
    </header>
  );
}
