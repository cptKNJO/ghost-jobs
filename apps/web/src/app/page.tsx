import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 py-20">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl lg:text-7xl">
          Track where your job applications
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The ultimate application tracker for modern software engineers. Sync
          your progress, manage interviews, and track offers in one place.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
