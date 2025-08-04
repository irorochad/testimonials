-- Add public sharing fields to projects table
ALTER TABLE "projects" ADD COLUMN "public_slug" varchar(100);
ALTER TABLE "projects" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;
ALTER TABLE "projects" ADD COLUMN "public_page_settings" jsonb DEFAULT '{}' NOT NULL;

-- Add unique constraint to public_slug
ALTER TABLE "projects" ADD CONSTRAINT "projects_public_slug_unique" UNIQUE("public_slug");

-- Add is_public field to testimonials table
ALTER TABLE "testimonials" ADD COLUMN "is_public" boolean DEFAULT true NOT NULL;