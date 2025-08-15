import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { widgetId: string } }
) {
  try {
    const { widgetId } = params
    const { searchParams } = new URL(request.url)
    
    // Get widget configuration from URL parameters
    const widgetType = searchParams.get('type') || 'carousel'
    const primaryColor = searchParams.get('primaryColor') || '#3b82f6'
    const backgroundColor = searchParams.get('backgroundColor') || '#ffffff'
    const textColor = searchParams.get('textColor') || '#1f2937'
    const borderRadius = parseInt(searchParams.get('borderRadius') || '8')
    const padding = parseInt(searchParams.get('padding') || '20')
    const fontSize = searchParams.get('fontSize') || 'base'
    const autoPlay = searchParams.get('autoPlay') === 'true'
    const slideInterval = parseInt(searchParams.get('slideInterval') || '4000')

    let widgetTestimonials = []

    // Check if widgetId is a group slug (6 characters) or individual testimonial slug (6 characters)
    if (widgetId.length === 6) {
      // Try to find by group slug first
      const group = await db
        .select({
          id: groups.id,
          projectId: groups.projectId,
        })
        .from(groups)
        .where(eq(groups.slug, widgetId))
        .limit(1)

      if (group.length > 0) {
        // Get testimonials for this group
        widgetTestimonials = await db
          .select({
            id: testimonials.id,
            customerName: testimonials.customerName,
            customerCompany: testimonials.customerCompany,
            customerTitle: testimonials.customerTitle,
            customerImageUrl: testimonials.customerImageUrl,
            content: testimonials.content,
            rating: testimonials.rating,
            createdAt: testimonials.createdAt,
          })
          .from(testimonials)
          .where(
            and(
              eq(testimonials.groupId, group[0].id),
              eq(testimonials.status, 'approved')
            )
          )
          .orderBy(testimonials.createdAt)
      } else {
        // Try to find individual testimonial by slug
        const testimonial = await db
          .select({
            id: testimonials.id,
            customerName: testimonials.customerName,
            customerCompany: testimonials.customerCompany,
            customerTitle: testimonials.customerTitle,
            customerImageUrl: testimonials.customerImageUrl,
            content: testimonials.content,
            rating: testimonials.rating,
            createdAt: testimonials.createdAt,
          })
          .from(testimonials)
          .where(
            and(
              eq(testimonials.slug, widgetId),
              eq(testimonials.status, 'approved')
            )
          )
          .limit(1)

        widgetTestimonials = testimonial
      }
    } else {
      // Assume it's a project public slug (longer than 6 characters)
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.publicSlug, widgetId))
        .limit(1)

      if (!project.length) {
        return NextResponse.json(
          { error: 'Widget not found' },
          { status: 404 }
        )
      }

      // Get approved testimonials for this project
      widgetTestimonials = await db
        .select({
          id: testimonials.id,
          customerName: testimonials.customerName,
          customerCompany: testimonials.customerCompany,
          customerTitle: testimonials.customerTitle,
          customerImageUrl: testimonials.customerImageUrl,
          content: testimonials.content,
          rating: testimonials.rating,
          createdAt: testimonials.createdAt,
        })
        .from(testimonials)
        .where(
          and(
            eq(testimonials.projectId, project[0].id),
            eq(testimonials.status, 'approved')
          )
        )
        .orderBy(testimonials.createdAt)
    }

    if (!widgetTestimonials.length) {
      return NextResponse.json(
        { error: 'No testimonials found' },
        { status: 404 }
      )
    }

    // Build widget configuration
    const widgetConfig = {
      id: widgetId,
      type: widgetType,
      styling: {
        primaryColor,
        backgroundColor,
        textColor,
        borderRadius,
        padding,
        fontSize,
      },
      behavior: {
        autoPlay,
        slideInterval,
        showNavigation: true,
        maxItems: 6,
      },
      testimonials: widgetTestimonials.map(testimonial => ({
        id: testimonial.id,
        customerName: testimonial.customerName || 'Anonymous',
        customerCompany: testimonial.customerCompany || '',
        customerTitle: testimonial.customerTitle || '',
        customerImageUrl: testimonial.customerImageUrl || '',
        content: testimonial.content || '',
        rating: testimonial.rating || 5,
        createdAt: testimonial.createdAt,
      }))
    }

    // Set CORS headers for embed usage
    const response = NextResponse.json(widgetConfig)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    // Cache for 5 minutes
    response.headers.set('Cache-Control', 'public, max-age=300')

    return response
  } catch (error) {
    console.error('Widget API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  // Handle CORS preflight requests
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}