import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Badge } from "@repo/ui/components/ui/badge";
import { Icon } from "@repo/ui/components/ui/icon";
import { createCheckoutAction, getPricingPlansAction } from "./actions";
import { getProfileWithSubscriptionAction } from "../dashboard/profile/actions";
import { CustomerBadge } from "@/components/shared/customer-badge";

export default async function PricingPage() {
  const plans = await getPricingPlansAction();
  const profile = await getProfileWithSubscriptionAction();
  const currentPlanId = profile?.subscription?.planId;

  const { free, human, robot } = {
    free: plans.find((n) => n.name === "free"),
    human: plans.find((n) => n.name === "human"),
    robot: plans.find((n) => n.name === "robot"),
  };

  const tiers = [
    {
      ...free,
      price: getPrice(free?.amount),
      description: "Perfect for getting started",
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      ...human,
      price: getPrice(human?.amount),
      description: "For the dedicated job seeker",
      badge: "I am human",
      buttonText: "Start Trial",
      buttonVariant: "default" as const,
    },
    {
      ...robot,
      price: getPrice(robot?.amount),
      description: "For the high-volume power user",
      badge: "I am robot",
      buttonText: "Start Trial",
      buttonVariant: "default" as const,
    },
  ];

  // const handleCheckout = async (planName: string) => {
  //   // setLoading(planName);
  //   try {
  //     await createCheckoutAction(planName);
  //   } catch (error) {
  //     console.error(error);
  //     // setLoading(null);
  //   }
  // };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 font-heading">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Choose the plan that fits your job search needs. No hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <Card key={tier.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                {tier.badge && <CustomerBadge plan={tier.name} />}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">${tier.price}</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <CardDescription className="mt-2">
                {tier.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Icon
                      name="check"
                      className="h-5 w-5 text-primary mr-2 shrink-0"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {currentPlanId === tier.id ? (
                <div className="w-full text-center py-2 font-semibold text-primary">
                  Your Current Plan
                </div>
              ) : (
                <form action={createCheckoutAction} className="w-full">
                  <input type="hidden" name="planId" value={tier.id} />
                  <Button
                    type="submit"
                    className="w-full"
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
                  </Button>
                </form>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function getPrice(amountInCents?: number) {
  if (!amountInCents) {
    return 0;
  }

  return amountInCents / 100;
}
