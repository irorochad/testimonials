import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { groups, projects, testimonials } from '@/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { z } from 'zod'
import { generateUniqueSlug } from '@/lib/slug-generator'

// Validation schema for creating a group
const createGroupSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional().default('#3B82F6'),
})

export async function GET(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's project first
    const userProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json([])
    }

    // Get all groups for the user's project with testimonial counts
    const groupsWithCounts = await db
      .select({
        id: groups.id,
        projectId: groups.projectId,
        slug: groups.slug,
        name: groups.name,
        description: groups.description,
        color: groups.color,
        createdAt: groups.createdAt,
        updatedAt: groups.updatedAt,
        testimonialCount: count(testimonials.id),
      })
      .from(groups)
      .leftJoin(testimonials, eq(groups.id, testimonials.groupId))
      .where(eq(groups.projectId, userProject[0].id))
      .groupBy(groups.id, groups.projectId, groups.slug, groups.name, groups.description, groups.color, groups.createdAt, groups.updatedAt)
      .orderBy(groups.createdAt)

    return NextResponse.json(groupsWithCounts)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()
    const validatedData = createGroupSchema.parse(body)

    // Get user's project first
    const userProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Generate unique 6-character slug for the group
    const slug = await generateUniqueSlug(async (slug: string) => {
      const existing = await db
        .select({ id: groups.id })
        .from(groups)
        .where(and(
          eq(groups.projectId, userProject[0].id),
          eq(groups.slug, slug)
        ))
        .limit(1)
      return existing.length > 0
    })

    // Create the group
    const newGroup = await db
      .insert(groups)
      .values({
        projectId: userProject[0].id,
        slug,
        name: validatedData.name,
        description: validatedData.description || null,
        color: validatedData.color,
      })
      .returning()

    return NextResponse.json(newGroup[0], { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}