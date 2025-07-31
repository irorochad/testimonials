import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, testimonials } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const domain = searchParams.get('domain');
    const tags = searchParams.get('tags')?.split(',') || [];

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Get project and verify domain
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project[0]) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Verify domain matches project's allowed domain
    if (domain) {
      const projectDomain = new URL(project[0].websiteUrl).hostname;
      const requestDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      
      if (projectDomain !== requestDomain) {
        return NextResponse.json(
          { error: 'Domain not authorized for this widget' },
          { status: 403 }
        );
      }
    }

    // Get approved testimonials for this project
    let testimonialsQuery = db
      .select({
        id: testimonials.id,
        customerName: testimonials.customerName,
        customerCompany: testimonials.customerCompany,
        customerTitle: testimonials.customerTitle,
        content: testimonials.content,
        rating: testimonials.rating,
        tags: testimonials.tags,
        createdAt: testimonials.createdAt,
      })
      .from(testimonials)
      .where(
        and(
          eq(testimonials.projectId, projectId),
          eq(testimonials.status, 'approved')
        )
      );

    const projectTestimonials = await testimonialsQuery;

    // Filter by tags if provided (for custom widget type)
    let filteredTestimonials = projectTestimonials;
    if (tags.length > 0) {
      filteredTestimonials = projectTestimonials.filter(testimonial => {
        const testimonialTags = testimonial.tags as string[] || [];
        return tags.some(tag => testimonialTags.includes(tag));
      });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project[0].id,
        name: project[0].name,
        websiteUrl: project[0].websiteUrl,
      },
      testimonials: filteredTestimonials,
    });

  } catch (error) {
    console.error('Error fetching widget config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget configuration' },
      { status: 500 }
    );
  }
}