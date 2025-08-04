import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicTestimonial, PublicPageSettings } from '@/db/types'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    // Get project by public slug
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

    if (!project[0]) {
      return NextResponse.json(
        { error: 'Project not found or not public' },
        { status: 404 }
      )
    }

    // Get approved and public testimonials for this project
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
        eq(testimonials.projectId, project[0].id),
        eq(testimonials.status, 'approved'),
        eq(testimonials.isPublic, true)
      ))
      .orderBy(testimonials.createdAt)

    const publicTestimonials: PublicTestimonial[] = testimonialsData.map(t => ({
      id: t.id,
      customerName: t.customerName,
      customerCompany: t.customerCompany || undefined,
      customerTitle: t.customerTitle || undefined,
      customerImageUrl: t.customerImageUrl || undefined,
      content: t.content,
      rating: t.rating || undefined,
      createdAt: t.createdAt,
    }))

    const publicPageSettings = project[0].publicPageSettings as PublicPageSettings || {
      theme: 'light',
      primaryColor: '#3B82F6',
      layout: 'grid',
      showRatings: true,
      showCompany: true,
      showTitle: true,
      showImages: true,
    }

    return NextResponse.json({
      project: {
        name: project[0].name,
        description: project[0].description,
        brandName: project[0].brandName,
        websiteUrl: project[0].websiteUrl,
        settings: publicPageSettings,
      },
      testimonials: publicTestimonials,
      totalCount: publicTestimonials.length,
    })

  } catch (error) {
    console.error('Error fetching public testimonials:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}