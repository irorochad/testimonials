-- Add slug column to groups table
DO $$ BEGIN
 ALTER TABLE "groups" ADD COLUMN "slug" varchar(6);
EXCEPTION
 WHEN duplicate_column THEN null;
END $$;

-- Generate unique 6-character slugs for existing groups
DO $$
DECLARE
    rec RECORD;
    new_slug varchar(6);
    counter integer := 1;
BEGIN
    FOR rec IN SELECT id, project_id FROM groups WHERE slug IS NULL LOOP
        LOOP
            -- Generate 6-character alphanumeric slug
            new_slug := substr(md5(random()::text || rec.id::text), 1, 6);
            -- Make sure it's unique within the project
            EXIT WHEN NOT EXISTS (
                SELECT 1 FROM groups 
                WHERE slug = new_slug AND project_id = rec.project_id
            );
        END LOOP;
        
        UPDATE groups SET slug = new_slug WHERE id = rec.id;
    END LOOP;
END $$;

-- Make slug column NOT NULL
DO $$ BEGIN
 ALTER TABLE "groups" ALTER COLUMN "slug" SET NOT NULL;
EXCEPTION
 WHEN others THEN null;
END $$;

-- Add unique constraint for groups project_id + slug combination
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'groups_proj_slug_uniq'
    ) THEN
        ALTER TABLE "groups" ADD CONSTRAINT "groups_proj_slug_uniq" 
        UNIQUE("project_id", "slug");
    END IF;
END $$;