import { config } from "@/config";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-heading text-center">
        Terms and Conditions
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to {config.title}. These Terms and Conditions govern your
            use of our website and services. By accessing or using our service,
            you agree to be bound by these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Use of Service</h2>
          <p>
            You must provide accurate information when creating an account. You
            are responsible for maintaining the security of your account and any
            activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Subscription and Fees
          </h2>
          <p>
            We offer different pricing tiers (Free, Human, and Robot). Fees are
            billed monthly in advance. Additional job tracking fees are
            calculated based on your usage as defined in our pricing page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            4. Intellectual Property
          </h2>
          <p>
            The service and its original content, features, and functionality
            are and will remain the exclusive property of {config.title} and its
            licensors.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Termination</h2>
          <p>
            In cases of urgent security concerns, illegal activity, or where
            required by law, we will provide you with reasonable prior notice
            via the email address associated with your account before any
            termination or suspension takes effect.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace
            these terms at any time. By continuing to access or use our service
            after those revisions become effective, you agree to be bound by the
            revised terms.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-12 italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
