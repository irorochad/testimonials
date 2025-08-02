CREATE TABLE "groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"color" varchar(7) DEFAULT '#3B82F6',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonials" ADD COLUMN "group_id" uuid;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" DROP COLUMN "company_url";--> statement-breakpoint
ALTER TABLE "testimonials" DROP COLUMN "moderation_score";--> statement-breakpoint
ALTER TABLE "testimonials" DROP COLUMN "moderation_flags";