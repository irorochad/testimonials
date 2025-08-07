import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/db'
import { forms, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Get the specific form
    const form = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, id), eq(forms.projectId, userProject[0].id)))
      .limit(1)

    if (!form[0]) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form[0])

  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, fields, styling, settings, isActive } = body

    // Get user's project
    const userProject = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1)

    if (!userProject[0]) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if form exists and belongs to user
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, id), eq(forms.projectId, userProject[0].id)))
      .limit(1)

    if (!existingForm[0]) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Update form
    const updatedForm = await db
      .update(forms)
      .set({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(fields && { fields }),
        ...(styling && { styling }),
        ...(settings && { settings }),
        ...(isActive !== undefined && { isActive }),
        updatedAt: new Date(),
      })
      .where(eq(forms.id, id))
      .returning()

    return NextResponse.json(updatedForm[0])

  } catch (error) {
    console.error('Error updating form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
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

    // Check if form exists and belongs to user
    const existingForm = await db
      .select()
      .from(forms)
      .where(and(eq(forms.id, id), eq(forms.projectId, userProject[0].id)))
      .limit(1)

    if (!existingForm[0]) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Delete form (cascade will handle submissions)
    await db
      .delete(forms)
      .where(eq(forms.id, id))

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}