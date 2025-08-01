import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { testimonials, projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Validate session
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { status } = await request.json();
        const { id: testimonialId } = await params;

        // Validate status
        const validStatuses = ['pending', 'approved', 'rejected', 'flagged'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        // Get the testimonial and verify ownership
        const testimonial = await db
            .select({
                id: testimonials.id,
                projectId: testimonials.projectId,
                status: testimonials.status,
            })
            .from(testimonials)
            .innerJoin(projects, eq(testimonials.projectId, projects.id))
            .where(
                and(
                    eq(testimonials.id, testimonialId),
                    eq(projects.userId, session.user.id)
                )
            )
            .limit(1);

        if (!testimonial[0]) {
            return NextResponse.json(
                { error: 'Testimonial not found or access denied' },
                { status: 404 }
            );
        }

        // Update the testimonial status
        const updateData: any = { status };

        // Set approvedAt timestamp if approving
        if (status === 'approved') {
            updateData.approvedAt = new Date();
        } else if (status !== 'approved' && testimonial[0].status === 'approved') {
            // Clear approvedAt if changing from approved to something else
            updateData.approvedAt = null;
        }

        await db
            .update(testimonials)
            .set(updateData)
            .where(eq(testimonials.id, testimonialId));

        return NextResponse.json({
            success: true,
            message: `Testimonial ${status} successfully`,
        });

    } catch (error) {
        console.error('Error updating testimonial status:', error);
        return NextResponse.json(
            { error: 'Failed to update testimonial status' },
            { status: 500 }
        );
    }
}