import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { PublicPageSettings } from '@/db/types'

// Generate a slug from project name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Check if slug is available
async function isSlugAvailable(slug: string, projectId?: string): Promise<boolean> {
  const existing = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      projectId 
        ? and(eq(projects.publicSlug, slug), ne(projects.id, projectId))
        : eq(projects.publicSlug, slug)
    )
    .limit(1)

  return existing.length === 0
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's project
    const userProject = await db
      .select({
        id: projects.id,
        name: projects.name,
        publicSlug: projects.publicSlug,
        isPublic: projects.isPublic,
        publicPageSettings: projects.publicPageSettings,
      })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = userProject[0]
    const settings = project.publicPageSettings as PublicPageSettings || {
      theme: 'light',
      primaryColor: '#3B82F6',
      layout: 'grid',
      showRatings: true,
      showCompany: true,
      showTitle: true,
      showImages: true,
    }

    return NextResponse.json({
      id: project.id,
      name: project.name,
      publicSlug: project.publicSlug,
      isPublic: project.isPublic,
      settings,
      publicUrl: project.publicSlug ? `${process.env.NEXT_PUBLIC_APP_URL}/p/${project.publicSlug}` : null,
    })

  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isPublic, publicSlug, settings } = body

    // Get user's project
    const userProject = await db
      .select({ id: projects.id, name: projects.name })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = userProject[0]
    let finalSlug = publicSlug

    // If enabling public and no slug provided, generate one
    if (isPublic && !finalSlug) {
      finalSlug = generateSlug(project.name)
      
      // Ensure slug is unique
      let counter = 1
      let baseSlug = finalSlug
      while (!(await isSlugAvailable(finalSlug, project.id))) {
        finalSlug = `${baseSlug}-${counter}`
        counter++
      }
    }

    // If slug provided, validate it
    if (finalSlug) {
      if (!/^[a-z0-9-]+$/.test(finalSlug)) {
        return NextResponse.json(
          { error: 'Slug can only contain lowercase letters, numbers, and hyphens' },
          { status: 400 }
        )
      }

      if (!(await isSlugAvailable(finalSlug, project.id))) {
        return NextResponse.json(
          { error: 'This slug is already taken' },
          { status: 400 }
        )
      }
    }

    // Update project
    await db
      .update(projects)
      .set({
        isPublic: isPublic || false,
        publicSlug: isPublic ? finalSlug : null,
        publicPageSettings: settings || {},
        updatedAt: new Date(),
      })
      .where(eq(projects.id, project.id))

    return NextResponse.json({
      success: true,
      publicSlug: isPublic ? finalSlug : null,
      publicUrl: isPublic && finalSlug ? `${process.env.NEXT_PUBLIC_APP_URL}/p/${finalSlug}` : null,
    })

  } catch (error) {
    console.error('Error updating public settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}