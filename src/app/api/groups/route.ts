import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { groups, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for creating a group
const createGroupSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().nullable().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional().default('#3B82F6'),
})

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

    // Verify the project belongs to the user
    const project = await db
      .select({ id: projects.id })
      .from(projects)
      .where(
        and(
          eq(projects.id, validatedData.projectId),
          eq(projects.userId, session.user.id)
        )
      )
      .limit(1)

    if (!project[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create the group
    const newGroup = await db
      .insert(groups)
      .values({
        projectId: validatedData.projectId,
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