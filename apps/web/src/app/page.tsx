import Link from "next/link";
import { ArrowRight, LayoutDashboard, Calendar, BarChart3 } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Card } from "@repo/ui/components/card";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 flex flex-col items-center text-center gap-8 py-20">
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

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to scale your hunt
          </h2>
          <p className="max-w-[42rem] text-muted-foreground sm:text-lg">
            Powerful tools designed to give you an edge in the competitive tech
            market.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <Card className="flex flex-col items-center text-center p-8 gap-4 bg-muted/50 border-none">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">Kanban Board</h3>
            <p className="text-sm text-muted-foreground">
              Visualize your pipeline. Drag and drop applications from
              &quot;Applied&quot; to &quot;Interview&quot; and
              &quot;Offer&quot;.
            </p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8 gap-4 bg-muted/50 border-none">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">Smart Reminders</h3>
            <p className="text-sm text-muted-foreground">
              Never miss a follow-up. Get automated notifications for interviews
              and deadline responses.
            </p>
          </Card>
          <Card className="flex flex-col items-center text-center p-8 gap-4 bg-muted/50 border-none">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-xl">AI Insights</h3>
            <p className="text-sm text-muted-foreground">
              Analyze your performance. Get data-driven advice on how to improve
              your interview conversion rates.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl font-bold">10k+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Applications
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl font-bold">500+</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Active Users
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl font-bold">98%</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Satisfaction
            </span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="text-4xl font-bold">24/7</span>
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
              Support
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
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
