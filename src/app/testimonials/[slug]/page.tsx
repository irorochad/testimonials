import { notFound } from 'next/navigation'
import { db } from '@/db'
import { testimonials, projects, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicTestimonialView } from '@/components/public/public-testimonial-view'

/**
 * Public Single Testimonial Page
 * 
 * Displays a single testimonial publicly using its slug.
 * URL format: /testimonials/[slug]
 * 
 * Features:
 * - Direct access to specific testimonials
 * - SEO-friendly URLs with slugs
 * - Proper meta tags for social sharing
 * - Clean, focused testimonial display
 */

interface PublicTestimonialPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PublicTestimonialPage({ params }: PublicTestimonialPageProps) {
  const { slug } = await params

  // Get the testimonial by slug with project and group info
  const testimonial = await db
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
      projectName: projects.name,
      projectId: testimonials.projectId,
      projectPublicPageSettings: projects.publicPageSettings,
      groupName: groups.name,
      groupColor: groups.color,
    })
    .from(testimonials)
    .innerJoin(projects, eq(testimonials.projectId, projects.id))
    .leftJoin(groups, eq(testimonials.groupId, groups.id))
    .where(and(
      eq(testimonials.slug, slug),
      eq(testimonials.status, 'approved'),
      eq(testimonials.isPublic, true)
    ))
    .limit(1)

  // Show 404 if testimonial not found or not public
  if (!testimonial[0]) {
    notFound()
  }

  return <PublicTestimonialView testimonial={testimonial[0]} />
}

/**
 * Generate metadata for SEO and social sharing
 */
export async function generateMetadata({ params }: PublicTestimonialPageProps) {
  const { slug } = await params

  const testimonial = await db
    .select({
      customerName: testimonials.customerName,
      customerCompany: testimonials.customerCompany,
      content: testimonials.content,
      projectName: projects.name,
    })
    .from(testimonials)
    .innerJoin(projects, eq(testimonials.projectId, projects.id))
    .where(and(
      eq(testimonials.slug, slug),
      eq(testimonials.status, 'approved'),
      eq(testimonials.isPublic, true)
    ))
    .limit(1)

  if (!testimonial[0]) {
    return {
      title: 'Testimonial Not Found',
      description: 'The testimonial you are looking for could not be found.'
    }
  }

  const { customerName, customerCompany, content, projectName } = testimonial[0]
  const truncatedContent = content.length > 160 ? content.substring(0, 160) + '...' : content
  const title = `${customerName}${customerCompany ? ` from ${customerCompany}` : ''} - ${projectName}`

  return {
    title,
    description: truncatedContent,
    openGraph: {
      title,
      description: truncatedContent,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title,
      description: truncatedContent,
    }
  }
}