import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, groups, testimonials } from "@/db/schema"
import { eq, count } from "drizzle-orm"
import { getUserProject } from "@/lib/testimonials"
import { GroupsView } from "@/components/testimonials/groups-view"

export default async function GroupsPage() {
    // Validate session on the server
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // If no valid session, redirect to login
    if (!session?.user) {
        redirect("/login");
    }

    // Check onboarding status from database
    try {
        const dbUser = await db
            .select({ onboardingCompleted: users.onboardingCompleted })
            .from(users)
            .where(eq(users.id, session.user.id))
            .limit(1);

        const onboardingCompleted = dbUser[0]?.onboardingCompleted ?? false;

        // If user hasn't completed onboarding, redirect to onboarding
        if (!onboardingCompleted) {
            redirect("/onboarding");
        }
    } catch (error) {
        console.error('Error checking onboarding status:', error);
        redirect("/onboarding");
    }

    // Get user's project
    const userProject = await getUserProject(session.user.id);

    if (!userProject) {
        redirect("/onboarding");
    }

    // Get groups for this project with testimonial counts
    const projectGroups = await db
        .select({
            id: groups.id,
            projectId: groups.projectId,
            name: groups.name,
            description: groups.description,
            color: groups.color,
            createdAt: groups.createdAt,
            updatedAt: groups.updatedAt,
            testimonialCount: count(testimonials.id),
        })
        .from(groups)
        .leftJoin(testimonials, eq(groups.id, testimonials.groupId))
        .where(eq(groups.projectId, userProject.id))
        .groupBy(groups.id)
        .orderBy(groups.createdAt);

    // Transform groups to ensure color is never null and add testimonial count
    const transformedGroups = projectGroups.map(group => ({
        ...group,
        color: group.color || '#3B82F6', // Provide default color if null
        testimonialCount: group.testimonialCount || 0
    }));

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Testimonial Groups</h1>
                        <p className="text-muted-foreground">
                            Organize testimonials into categories and groups
                            <span className="block text-sm mt-1">
                                Project: <span className="font-medium">{userProject?.name}</span>
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <GroupsView
                groups={transformedGroups}
                projectId={userProject.id}
            />
        </div>
    )
}