CREATE TABLE "job_post" (
	"company_id" integer,
	"source_id" integer,
	"status_id" integer NOT NULL,
	"profile_id" integer NOT NULL,
	"applied_on" timestamp with time zone DEFAULT now() NOT NULL,
	"replied_on" timestamp with time zone,
	"role" text NOT NULL,
	"link_to_post" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_status_id_statuses_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."statuses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_post" ADD CONSTRAINT "job_post_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;
