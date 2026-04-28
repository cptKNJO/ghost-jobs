import { config } from "@/config";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-heading text-center">
        Privacy Policy
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            1. Information We Collect
          </h2>
          <p>
            We collect information you provide directly to us when you create an
            account, such as your name, email address, and job application data.
            We use strictly necessary cookies to maintain your login session; we
            do not use tracking or analytics cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, to process payments, and to communicate with you about
            your account and our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            3. Data Sharing and Disclosure
          </h2>
          <p>
            We do not share your personal information with third parties except
            as necessary to provide our services (e.g., payment processors) or
            as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information
            from loss, theft, misuse, and unauthorized access. However, no
            internet transmission is ever completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal
            information. You can manage your account settings within the
            application or contact us for assistance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            6. Changes to This Policy
          </h2>
          <p>
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new privacy policy on this page.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-12 italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
