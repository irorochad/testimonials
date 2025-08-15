-- Create test data for widget testing
-- Run this in your database to create test data

-- First, you need to get your actual user ID from the users table
-- Replace 'YOUR_USER_ID_HERE' with your actual user ID

-- Create a test project
INSERT INTO projects (
  id, 
  user_id, 
  name, 
  description,
  public_slug, 
  is_public, 
  embed_code,
  created_at,
  updated_at
) VALUES (
  'test-project-12345',
  'YOUR_USER_ID_HERE', -- Replace with your actual user ID
  'Test Widget Project',
  'A test project for widget development',
  'test-project-slug',
  true,
  'test-embed-code',
  NOW(),
  NOW()
) ON CONFLICT (public_slug) DO NOTHING;

-- Create a test group
INSERT INTO groups (
  id,
  project_id,
  slug,
  name,
  description,
  color,
  created_at,
  updated_at
) VALUES (
  'test-group-12345',
  'test-project-12345',
  'abc123',
  'Test Group',
  'A test group for widget development',
  '#3B82F6',
  NOW(),
  NOW()
) ON CONFLICT (project_id, slug) DO NOTHING;

-- Create test testimonials
INSERT INTO testimonials (
  id,
  project_id,
  group_id,
  slug,
  customer_name,
  customer_email,
  customer_company,
  customer_title,
  content,
  rating,
  status,
  is_public,
  source,
  created_at,
  approved_at
) VALUES 
-- Testimonials in the test group (for group widget testing)
(
  'testimonial-group-1',
  'test-project-12345',
  'test-group-12345',
  'grp001',
  'Alice Cooper',
  'alice@grouptest.com',
  'Group Test Corp',
  'CEO',
  'This group feature is fantastic! It helps us organize testimonials perfectly.',
  5,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
),
(
  'testimonial-group-2',
  'test-project-12345',
  'test-group-12345',
  'grp002',
  'Bob Wilson',
  'bob@grouptest.com',
  'Group Solutions',
  'CTO',
  'The grouping functionality makes it so much easier to manage our testimonials.',
  5,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
),
-- Individual testimonial for single testimonial widget testing
(
  'testimonial-individual',
  'test-project-12345',
  NULL,
  'xyz789',
  'Charlie Brown',
  'charlie@individual.com',
  'Solo Ventures',
  'Founder',
  'This individual testimonial widget is perfect for showcasing specific customer feedback!',
  5,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
),
-- General project testimonials (for project widget testing)
(
  'testimonial-1',
  'test-project-12345',
  NULL,
  'test01',
  'John Doe',
  'john@example.com',
  'Acme Corp',
  'CEO',
  'This product has completely transformed our workflow. The team loves how intuitive and powerful it is. Highly recommended!',
  5,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
),
(
  'testimonial-2',
  'test-project-12345',
  NULL,
  'test02',
  'Sarah Johnson',
  'sarah@techstartup.com',
  'TechStartup Inc',
  'Product Manager',
  'Amazing customer support and the features are exactly what we needed. The integration was seamless.',
  5,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
),
(
  'testimonial-3',
  'test-project-12345',
  NULL,
  'test03',
  'Mike Chen',
  'mike@designstudio.com',
  'Design Studio',
  'Creative Director',
  'The user interface is beautiful and the functionality is top-notch. Our clients are impressed!',
  4,
  'approved',
  true,
  'manual',
  NOW(),
  NOW()
)
ON CONFLICT (project_id, slug) DO NOTHING;

-- Verify the data was created
SELECT 'Projects created:' as info, COUNT(*) as count FROM projects WHERE public_slug = 'test-project-slug';
SELECT 'Testimonials created:' as info, COUNT(*) as count FROM testimonials WHERE project_id = 'test-project-12345' AND status = 'approved';

-- Show the created data
SELECT 
  p.name as project_name,
  p.public_slug,
  p.is_public,
  COUNT(t.id) as testimonial_count
FROM projects p
LEFT JOIN testimonials t ON p.id = t.project_id AND t.status = 'approved'
WHERE p.public_slug = 'test-project-slug'
GROUP BY p.id, p.name, p.public_slug, p.is_public;