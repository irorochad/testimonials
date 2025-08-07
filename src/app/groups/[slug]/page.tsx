import { notFound } from 'next/navigation'
import { db } from '@/db'
import { groups, projects, testimonials } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicGroupView } from '@/components/public/public-group-view'

/**
 * Public Group Page
 * 
 * Displays all testimonials in a specific group publicly using the group's slug.
 * URL format: /groups/[slug]
 * 
 * Features:
 * - Direct access to specific testimonial groups
 * - SEO-friendly URLs with slugs
 * - Proper meta tags for social sharing
 * - Clean group testimonials display
 */

interface PublicGroupPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicGroupPage({ params }: PublicGroupPageProps) {
  const { slug } = await params

  // Get the group by slug with project info
  const group = await db
    .select({
      id: groups.id,
      slug: groups.slug,
      name: groups.name,
      description: groups.description,
      color: groups.color,
      projectName: projects.name,
      projectId: groups.projectId,
    })
    .from(groups)
    .innerJoin(projects, eq(groups.projectId, projects.id))
    .where(eq(groups.slug, slug))
    .limit(1)

  // Show 404 if group not found
  if (!group[0]) {
    notFound()
  }

  // Get all approved and public testimonials in this group
  const groupTestimonials = await db
    .select({
      id: testimonials.id,
      slug: testimonials.slug,
      customerName: testimonials.customerName,
      customerCompany: testimonials.customerCompany,
      customerTitle: testimonials.customerTitle,
      customerImageUrl: testimonials.customerImageUrl,
      content: testimonials.content,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
    })
    .from(testimonials)
    .where(and(
      eq(testimonials.groupId, group[0].id),
      eq(testimonials.status, 'approved'),
      eq(testimonials.isPublic, true)
    ))
    .orderBy(testimonials.createdAt)

  return (
    <PublicGroupView
      group={group[0]}
      testimonials={groupTestimonials}
    />
  )
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: PublicGroupPageProps) {
  const { slug } = await params

  const group = await db
    .select({
      name: groups.name,
      description: groups.description,
      projectName: projects.name,
    })
    .from(groups)
    .innerJoin(projects, eq(groups.projectId, projects.id))
    .where(eq(groups.slug, slug))
    .limit(1)

  if (!group[0]) {
    return {
      title: 'Group Not Found',
      description: 'The testimonial group you are looking for could not be found.'
    }
  }

  const { name, description, projectName } = group[0]
  const title = `${name} Testimonials - ${projectName}`
  const desc = description || `Customer testimonials from the ${name} group`

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description: desc,
    }
  }
}