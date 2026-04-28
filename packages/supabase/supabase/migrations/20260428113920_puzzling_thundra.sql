CREATE TABLE "pricing_plans" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pricing_plans_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(20) NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb,
	"interval" text DEFAULT 'month' NOT NULL,
	"currency" text DEFAULT 'usd' NOT NULL,
	"amount" integer NOT NULL,
	"hard_limit" integer NOT NULL,
	"billing_provider" text DEFAULT 'stripe' NOT NULL,
	"provider_price_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_plans_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"profile_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"external_customer_id" text,
	"external_subscription_id" text,
	"status" varchar(50) NOT NULL,
	"usage_count" integer DEFAULT 0,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"current_period_start" timestamp with time zone,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_profile_id_unique" UNIQUE("profile_id"),
	CONSTRAINT "subscriptions_external_customer_id_unique" UNIQUE("external_customer_id"),
	CONSTRAINT "subscriptions_external_subscription_id_unique" UNIQUE("external_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_pricing_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."pricing_plans"("id") ON DELETE no action ON UPDATE no action;

-- subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON subscriptions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- pricing_plans table
DROP TRIGGER IF EXISTS update_pricing_plans_updated_at ON pricing_plans;
CREATE TRIGGER update_pricing_plans_updated_at
BEFORE UPDATE ON pricing_plans
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
