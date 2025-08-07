import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { TestimonialDetail } from "@/components/testimonials/testimonial-detail"
import { NotFound } from "@/components/not-found"
import { getUserTestimonial } from "@/lib/testimonials"

export default async function TestimonialPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Validate session
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect("/login");
    }

    // Check onboarding status
    try {
        const dbUser = await db
            .select({ onboardingCompleted: users.onboardingCompleted })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        const onboardingCompleted = dbUser[0]?.onboardingCompleted ?? false;

        if (!onboardingCompleted) {
            redirect("/onboarding");
        }
    } catch (error) {
        // console.error('Error checking onboarding status:', error);
        redirect("/onboarding");
    }

    // Get testimonial ID from params
    const { id: testimonialId } = await params;

    // Get the testimonial using shared utility
    const testimonial = await getUserTestimonial(session.user.id, testimonialId);

    // Show custom 404 if testimonial not found or no access
    if (!testimonial) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Testimonials</h1>
                            <p className="text-muted-foreground">
                                Manage and review customer testimonials
                            </p>
                        </div>
                    </div>
                </div>

                <NotFound
                    title="Testimonial not found"
                    description="The testimonial you're looking for doesn't exist or you don't have permission to view it."
                    backLabel="Back to Testimonials"
                    backPath="/testimonials"
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Testimonial Details</h1>
                        <p className="text-muted-foreground">
                            View and manage testimonial from {testimonial.customerName}
                            <span className="block text-sm mt-1">
                                Project: <span className="font-medium">{testimonial.projectName}</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <TestimonialDetail testimonial={testimonial} />
        </div>
    )
}