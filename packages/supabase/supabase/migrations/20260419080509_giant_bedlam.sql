ALTER TABLE "statuses" DROP CONSTRAINT "statuses_name_unique";--> statement-breakpoint
ALTER TABLE "statuses" ADD COLUMN "code" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "statuses" ADD CONSTRAINT "statuses_code_unique" UNIQUE("code");