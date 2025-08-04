import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, websiteUrl } = body

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      )
    }

    // Validate URL format if provided
    if (websiteUrl && websiteUrl.trim()) {
      try {
        new URL(websiteUrl)
      } catch {
        return NextResponse.json(
          { error: 'Please enter a valid URL' },
          { status: 400 }
        )
      }
    }

    // Get user's project
    const userProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update project
    const updatedProject = await db
      .update(projects)
      .set({
        name: name.trim(),
        description: description?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(projects.id, userProject[0].id))
      .returning()

    return NextResponse.json(updatedProject[0])

  } catch (error) {
    console.error('Error updating basic info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}