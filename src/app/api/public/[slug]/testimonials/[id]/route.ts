import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { PublicTestimonial, PublicPageSettings } from '@/db/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  try {
    const { slug, id } = await params

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

    // Get specific testimonial
    const testimonialData = await db
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
        eq(testimonials.id, id),
        eq(testimonials.projectId, project[0].id),
        eq(testimonials.status, 'approved'),
        eq(testimonials.isPublic, true)
      ))
      .limit(1)

    if (!testimonialData[0]) {
      return NextResponse.json(
        { error: 'Testimonial not found or not public' },
        { status: 404 }
      )
    }

    const testimonial = testimonialData[0]
    const publicTestimonial: PublicTestimonial = {
      id: testimonial.id,
      customerName: testimonial.customerName,
      customerCompany: testimonial.customerCompany || undefined,
      customerTitle: testimonial.customerTitle || undefined,
      customerImageUrl: testimonial.customerImageUrl || undefined,
      content: testimonial.content,
      rating: testimonial.rating || undefined,
      createdAt: testimonial.createdAt,
    }

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
      testimonial: publicTestimonial,
    })

  } catch (error) {
    console.error('Error fetching public testimonial:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}