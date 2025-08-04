import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PublicTestimonialsView } from '@/components/public/public-testimonials-view'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicTestimonial, PublicPageSettings } from '@/db/types'

interface PublicPageProps {
  params: Promise<{ slug: string }>
}

async function getPublicProject(slug: string) {
  const project = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      brandName: projects.brandName,
      websiteUrl: projects.websiteUrl,
      isPublic: projects.isPublic,
      publicPageSettings: projects.publicPageSettings,
    })
    .from(projects)
    .where(and(
      eq(projects.publicSlug, slug),
      eq(projects.isPublic, true)
    ))
    .limit(1)

  return project[0] || null
}

async function getPublicTestimonials(projectId: string) {
  const testimonialsData = await db
    .select({
      id: testimonials.id,
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
    .leftJoin(groups, eq(testimonials.groupId, groups.id))
    .where(and(
      eq(testimonials.projectId, projectId),
      eq(testimonials.status, 'approved'),
      eq(testimonials.isPublic, true)
    ))
    .orderBy(testimonials.createdAt)

  return testimonialsData.map(t => ({
    id: t.id,
    customerName: t.customerName,
    customerCompany: t.customerCompany || undefined,
    customerTitle: t.customerTitle || undefined,
    customerImageUrl: t.customerImageUrl || undefined,
    content: t.content,
    rating: t.rating || undefined,
    createdAt: t.createdAt,
  })) as PublicTestimonial[]
}

export async function generateMetadata({ params }: PublicPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProject(slug)
  
  if (!project) {
    return {
      title: 'Page Not Found',
    }
  }

  const title = `${project.brandName || project.name} - Customer Testimonials`
  const description = project.description || `Read what customers are saying about ${project.brandName || project.name}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/p/${slug}`,
      siteName: project.brandName || project.name,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PublicTestimonialsPage({ params }: PublicPageProps) {
  const { slug } = await params
  const project = await getPublicProject(slug)
  
  if (!project) {
    notFound()
  }

  const testimonials = await getPublicTestimonials(project.id)
  
  const settings = project.publicPageSettings as PublicPageSettings || {
    theme: 'light',
    primaryColor: '#3B82F6',
    layout: 'grid',
    showRatings: true,
    showCompany: true,
    showTitle: true,
    showImages: true,
  }

  return (
    <PublicTestimonialsView
      project={{
        name: project.name,
        description: project.description,
        brandName: project.brandName,
        websiteUrl: project.websiteUrl,
        settings,
      }}
      testimonials={testimonials}
      slug={slug}
    />
  )
}