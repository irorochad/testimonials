import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserTestimonials } from "@/lib/testimonials"
import { db } from "@/db"
import { projects, testimonials, groups } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    // Get session from request
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')

    // If groupId is provided, fetch testimonials for that specific group
    if (groupId) {
      try {
        // Get user's project first
        const userProject = await db
          .select({ id: projects.id })
          .from(projects)
          .where(eq(projects.userId, session.user.id))
          .limit(1);

        if (!userProject[0]) {
          return NextResponse.json({ testimonials: [] })
        }

        // Fetch testimonials for the specific group (only approved ones for export)
        const result = await db
          .select({
            id: testimonials.id,
            customerName: testimonials.customerName,
            customerEmail: testimonials.customerEmail,
            customerCompany: testimonials.customerCompany,
            customerTitle: testimonials.customerTitle,
            customerImageUrl: testimonials.customerImageUrl,
            content: testimonials.content,
            rating: testimonials.rating,
            status: testimonials.status,
            source: testimonials.source,
            sourceMetadata: testimonials.sourceMetadata,
            tags: testimonials.tags,
            createdAt: testimonials.createdAt,
            approvedAt: testimonials.approvedAt,
            projectId: testimonials.projectId,
            projectName: projects.name,
            groupId: testimonials.groupId,
            groupName: groups.name,
            groupColor: groups.color,
          })
          .from(testimonials)
          .innerJoin(projects, eq(testimonials.projectId, projects.id))
          .leftJoin(groups, eq(testimonials.groupId, groups.id))
          .where(
            and(
              eq(testimonials.projectId, userProject[0].id),
              eq(testimonials.groupId, groupId),
              eq(testimonials.status, 'approved')
            )
          )
          .orderBy(testimonials.createdAt);

        const groupTestimonialsData = result.map(item => ({
          ...item,
          tags: item.tags as string[] | null,
          sourceMetadata: item.sourceMetadata as any
        }));

        return NextResponse.json({ testimonials: groupTestimonialsData })
      } catch (error) {
        console.error('Error fetching group testimonials:', error);
        return NextResponse.json({ testimonials: [] })
      }
    }

    // Default behavior: get all user's testimonials
    const userTestimonials = await getUserTestimonials(session.user.id)

    return NextResponse.json({ testimonials: userTestimonials })
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    )
  }
}