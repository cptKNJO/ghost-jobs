import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@repo/ui/components/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 py-20">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground animate-in fade-in slide-in-from-top-4 duration-1000">
          <span className="mr-1">✨</span>
          <span>Now in beta - Join 500+ engineers today</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl lg:text-7xl">
          Land Your Dream Job, <br />
          <span className="text-primary">Organized.</span>
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
          <Button variant="outline" size="lg" className="h-12 px-8">
            View Demo
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground sm:px-12 lg:px-16">
          <div className="relative z-10 flex flex-col items-center gap-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl max-w-2xl">
              Ready to take control of your career path?
            </h2>
            <p className="max-w-[32rem] text-primary-foreground/80 sm:text-lg">
              Join hundreds of software engineers who have landed their dream
              roles using JobTracker.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute top-0 left-0 h-full w-full opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-white/20 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  );
}
