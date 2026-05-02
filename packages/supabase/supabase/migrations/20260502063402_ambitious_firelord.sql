ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_profile_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_external_customer_id_unique";--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "external_customer_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "external_customer_id";--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_external_customer_id_unique" UNIQUE("external_customer_id");