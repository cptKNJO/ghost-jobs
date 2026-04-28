ALTER TABLE "pricing_plans" ADD COLUMN "provider_price_base_id" text;--> statement-breakpoint
ALTER TABLE "pricing_plans" ADD COLUMN "provider_price_metered_id" text;--> statement-breakpoint
ALTER TABLE "pricing_plans" DROP COLUMN "provider_price_id";