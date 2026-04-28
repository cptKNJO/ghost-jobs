import { config } from "@/config";

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-heading text-center">
        Refund Policy
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Free Trial</h2>
          <p>
            We offer a 7-day free trial for our "Human" and "Robot" plans. No
            credit card is required to start your trial. This allows you to test
            our full features before committing to a subscription.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Subscriptions</h2>
          <p>
            Subscriptions are billed on a monthly basis. You can cancel your
            subscription at any time. If you cancel, you will continue to have
            access to your paid features until the end of your current billing
            cycle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Refund Eligibility</h2>
          <p>
            Due to the digital nature of our service and the availability of a
            free trial, we generally do not offer refunds after a subscription
            payment has been processed. However, we may consider refund requests
            in exceptional circumstances or where required by law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Usage-Based Fees</h2>
          <p>
            Usage-based fees (e.g., additional job tracking beyond your plan
            limit) are non-refundable once the usage has occurred.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">
            5. How to Request a Refund
          </h2>
          <p>
            To request a refund for an exceptional case, please contact our
            support team from your profile page within the application.
          </p>
        </section>

        <p className="text-sm text-muted-foreground mt-12 italic">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
