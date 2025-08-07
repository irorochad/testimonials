import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects, testimonials, groups } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const widgetId = searchParams.get('widgetId')
    const projectSlug = searchParams.get('projectSlug')
    const domain = searchParams.get('domain')

    if (!widgetId && !projectSlug) {
      return NextResponse.json(
        { error: 'Widget ID or project slug is required' },
        { status: 400 }
      )
    }

    // Get project data
    let project
    if (projectSlug) {
      const projectResult = await db
        .select()
        .from(projects)
        .where(eq(projects.publicSlug, projectSlug))
        .limit(1)

      if (!projectResult.length) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        )
      }
      project = projectResult[0]
    } else {
      // For widget ID, we'll need to implement widget storage
      // For now, return error
      return NextResponse.json(
        { error: 'Widget ID lookup not implemented yet' },
        { status: 501 }
      )
    }

    // Check if domain is allowed (optional security check)
    // You can implement domain whitelist here if needed

    // Get approved testimonials for the project
    const projectTestimonials = await db
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
      .where(
        and(
          eq(testimonials.projectId, project.id),
          eq(testimonials.status, 'approved')
        )
      )
      .orderBy(testimonials.createdAt)

    // Transform testimonials for widget consumption
    const widgetTestimonials = projectTestimonials.map(testimonial => ({
      id: testimonial.id,
      customerName: testimonial.customerName,
      customerCompany: testimonial.customerCompany,
      customerTitle: testimonial.customerTitle,
      avatar: testimonial.customerImageUrl,
      content: testimonial.content,
      rating: testimonial.rating,
      createdAt: testimonial.createdAt,
      group: testimonial.groupName ? {
        name: testimonial.groupName,
        color: testimonial.groupColor
      } : null
    }))

    // Get project settings for widget styling
    const publicSettings = project.publicPageSettings as any || {}

    const response = {
      project: {
        id: project.id,
        name: project.name,
        slug: project.publicSlug,
      },
      testimonials: widgetTestimonials,
      settings: {
        theme: publicSettings.theme || 'light',
        primaryColor: publicSettings.primaryColor || '#3B82F6',
        showRatings: publicSettings.showRatings !== false,
        showCompany: publicSettings.showCompany !== false,
        showTitle: publicSettings.showTitle !== false,
        showImages: publicSettings.showImages !== false,
        headerTitle: publicSettings.headerTitle,
        headerDescription: publicSettings.headerDescription,
      }
    }

    // Set CORS headers for cross-origin requests
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    }

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('Widget config API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}