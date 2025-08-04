import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicTestimonialView } from '@/components/public/public-testimonial-view'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicTestimonial, PublicPageSettings } from '@/db/types'

interface PublicTestimonialPageProps {
  params: Promise<{ slug: string; id: string }>
}

async function getPublicTestimonial(slug: string, testimonialId: string) {
  const result = await db
    .select({
      // Project fields
      projectId: projects.id,
      projectName: projects.name,
      projectDescription: projects.description,
      brandName: projects.brandName,
      websiteUrl: projects.websiteUrl,
      isPublic: projects.isPublic,
      publicPageSettings: projects.publicPageSettings,
      // Testimonial fields
      testimonialId: testimonials.id,
      customerName: testimonials.customerName,
      customerCompany: testimonials.customerCompany,
      customerTitle: testimonials.customerTitle,
      customerImageUrl: testimonials.customerImageUrl,
      content: testimonials.content,
      rating: testimonials.rating,
      createdAt: testimonials.createdAt,
      groupName: groups.name,
      groupColor: groups.color,
    })
    .from(testimonials)
    .innerJoin(projects, eq(testimonials.projectId, projects.id))
    .leftJoin(groups, eq(testimonials.groupId, groups.id))
    .where(and(
      eq(projects.publicSlug, slug),
      eq(projects.isPublic, true),
      eq(testimonials.id, testimonialId),
      eq(testimonials.status, 'approved'),
      eq(testimonials.isPublic, true)
    ))
    .limit(1)

  if (!result[0]) return null

  const data = result[0]
  return {
    project: {
      id: data.projectId,
      name: data.projectName,
      description: data.projectDescription,
      brandName: data.brandName,
      websiteUrl: data.websiteUrl,
      settings: data.publicPageSettings as PublicPageSettings || {
        theme: 'light',
        primaryColor: '#3B82F6',
        layout: 'grid',
        showRatings: true,
        showCompany: true,
        showTitle: true,
        showImages: true,
      },
    },
    testimonial: {
      id: data.testimonialId,
      customerName: data.customerName,
      customerCompany: data.customerCompany || undefined,
      customerTitle: data.customerTitle || undefined,
      customerImageUrl: data.customerImageUrl || undefined,
      content: data.content,
      rating: data.rating || undefined,
      createdAt: data.createdAt,
    } as PublicTestimonial,
  }
}

export async function generateMetadata({ params }: PublicTestimonialPageProps): Promise<Metadata> {
  const { slug, id } = await params
  const data = await getPublicTestimonial(slug, id)
  
  if (!data) {
    return {
      title: 'Testimonial Not Found',
    }
  }

  const { project, testimonial } = data
  const title = `${testimonial.customerName} - ${project.brandName || project.name} Testimonial`
  const description = testimonial.content.length > 160 
    ? `${testimonial.content.substring(0, 157)}...`
    : testimonial.content

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}/t/${id}`,
      siteName: project.brandName || project.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PublicTestimonialPage({ params }: PublicTestimonialPageProps) {
  const { slug, id } = await params
  const data = await getPublicTestimonial(slug, id)
  
  if (!data) {
    notFound()
  }

  return (
    <PublicTestimonialView
      project={data.project}
      testimonial={data.testimonial}
      slug={slug}
    />
  )
}