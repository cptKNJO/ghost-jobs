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
import Link from "next/link";

export default function PricingPage() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: ["Infinite jobs per month", "Basic job tracking"],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Human",
      price: "$2",
      description: "For the dedicated job seeker",
      features: [
        "100 jobs per month included",
        "$0.01 per additional job",
        'Special "I am human" label',
        "7-day free trial",
      ],
      badge: "I am human",
      buttonText: "Start Trial",
      buttonVariant: "default" as const,
    },
    {
      name: "Robot",
      price: "$5",
      description: "For the high-volume power user",
      features: [
        "500 jobs per month included",
        "$0.01 per additional job",
        'Special "I am robot" label',
        "7-day free trial",
      ],
      badge: "I am robot",
      buttonText: "Start Trial",
      buttonVariant: "default" as const,
    },
  ];

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
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                {tier.badge && (
                  <Badge variant="secondary" className="font-semibold">
                    {tier.badge}
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">{tier.price}</span>
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
              <Button className="w-full" variant={tier.buttonVariant} asChild>
                <Link href="/login">{tier.buttonText}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
