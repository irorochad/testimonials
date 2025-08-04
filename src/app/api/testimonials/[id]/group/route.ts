import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/db'
import { testimonials, projects } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Validation schema for updating testimonial group
const updateGroupSchema = z.object({
    groupId: z.string().uuid().nullable(),
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

        // Verify the testimonial exists and belongs to the user's project
        const existingTestimonial = await db
            .select({
                id: testimonials.id,
                projectId: testimonials.projectId,
            })
            .from(testimonials)
            .innerJoin(projects, eq(testimonials.projectId, projects.id))
            .where(
                and(
                    eq(testimonials.id, id),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1)

        if (!existingTestimonial[0]) {
            return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 })
        }

        // Update the testimonial's group
        const updatedTestimonial = await db
            .update(testimonials)
            .set({
                groupId: validatedData.groupId,
            })
            .where(eq(testimonials.id, id))
            .returning()

        return NextResponse.json(updatedTestimonial[0])
    } catch (error) {
        console.error('Error updating testimonial group:', error)

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