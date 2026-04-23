import { Icon } from "@repo/ui/components/ui/icon";
import { Link } from "@repo/ui/components/ui/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-4">
      {/* Hero Section */}
      <section className="flex flex-col gap-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl lg:text-7xl relative">
          Track what works and
          <br /> save time.
          <small className="absolute px-2 text-sm sm:text-lg text-accent-foreground bg-accent origin-center rotate-x-10 rotate-z-20 -translate-x-11 -translate-y-0.5 -z-10">
            for others
          </small>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground text-lg sm:text-xl sm:leading-8">
          Chase jobs, not spirits
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/login">
            Get Started <Icon name="arrow-right" className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
      <section>
        <h2 className="text-xl font-bold">WIP: Roadmap</h2>
        <ul className="list-disc list-inside">
          <li>
            Tweak your resume by modifying it in the{" "}
            <strong>built-in editor</strong>.
          </li>
          <li>
            Create <strong>different versions</strong> of your resume and see
            what works.
          </li>
          <li>
            <strong>Export</strong> resumes and all your data - no lock-in.
          </li>
          <li>
            Track and tweak <strong>on-the-go</strong>.
          </li>
        </ul>
      </section>
    </div>
  );
}
