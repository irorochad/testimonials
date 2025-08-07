import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { groups, projects, testimonials } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for updating a group
const updateGroupSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().nullable().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
})

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Get session
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Parse request body
        const body = await request.json()
        const validatedData = updateGroupSchema.parse(body)

        // Verify the group exists and belongs to the user's project
        const existingGroup = await db
            .select({
                id: groups.id,
                projectId: groups.projectId,
                slug: groups.slug,
            })
            .from(groups)
            .innerJoin(projects, eq(groups.projectId, projects.id))
            .where(
                and(
                    eq(groups.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1)

        if (!existingGroup[0]) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 })
        }

        // Update the group
        const updatedGroup = await db
            .update(groups)
            .set({
                ...validatedData,
                updatedAt: new Date(),
            })
            .where(eq(groups.id, id))
            .returning()

        return NextResponse.json(updatedGroup[0])
    } catch (error) {
        console.error('Error updating group:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Get session
        const session = await auth.api.getSession({
            headers: request.headers
        })

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify the group exists and belongs to the user's project
        const existingGroup = await db
            .select({
                id: groups.id,
                projectId: groups.projectId,
                slug: groups.slug,
            })
            .from(groups)
            .innerJoin(projects, eq(groups.projectId, projects.id))
            .where(
                and(
                    eq(groups.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1)

        if (!existingGroup[0]) {
            return NextResponse.json({ error: 'Group not found' }, { status: 404 })
        }

        // First, update any testimonials in this group to be uncategorized (set groupId to null)
        await db
            .update(testimonials)
            .set({ groupId: null })
            .where(eq(testimonials.groupId, id))

        // Then delete the group
        await db
            .delete(groups)
            .where(eq(groups.id, id))

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting group:', error)

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}