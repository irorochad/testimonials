import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { forms, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { FormField, FormStyling, FormSettings } from '@/db/types'

// Generate a slug from form name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Check if slug is available within project
async function isSlugAvailable(slug: string, projectId: string, formId?: string): Promise<boolean> {
  const existing = await db
    .select({ id: forms.id })
    .from(forms)
    .where(
      formId 
        ? and(eq(forms.projectId, projectId), eq(forms.slug, slug), eq(forms.id, formId))
        : and(eq(forms.projectId, projectId), eq(forms.slug, slug))
    )
    .limit(1)

  return existing.length === 0
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    // Get all forms for the project
    const userForms = await db
      .select()
      .from(forms)
      .where(eq(forms.projectId, userProject[0].id))
      .orderBy(forms.createdAt)

    return NextResponse.json(userForms)

  } catch (error) {
    console.error('Error fetching forms:', error)
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
    const { name, description, fields, styling, settings } = body

    if (!name || !fields) {
      return NextResponse.json({ error: 'Name and fields are required' }, { status: 400 })
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

    // Generate unique slug
    let slug = generateSlug(name)
    let counter = 1
    const baseSlug = slug
    while (!(await isSlugAvailable(slug, userProject[0].id))) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Create form with default values
    const defaultStyling: FormStyling = {
      primaryColor: '#3B82F6',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      fontFamily: 'Inter',
      borderRadius: 8,
      layout: 'single-column',
      theme: 'light',
      ...styling
    }

    const defaultSettings: FormSettings = {
      allowMultipleSubmissions: false,
      requireEmailVerification: false,
      enableSpamProtection: true,
      enableAnalytics: true,
      autoApprove: false,
      collectIpAddress: true,
      enableFileUploads: true,
      maxFileSize: 10,
      allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
      ...settings
    }

    const newForm = await db
      .insert(forms)
      .values({
        projectId: userProject[0].id,
        name,
        description,
        slug,
        fields: fields as FormField[],
        styling: defaultStyling,
        settings: defaultSettings,
      })
      .returning()

    return NextResponse.json(newForm[0], { status: 201 })

  } catch (error) {
    console.error('Error creating form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}