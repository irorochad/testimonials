import { TestimonialsView } from "@/components/testimonials/testimonials-view"
import { EmptyState } from "@/components/empty-state"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, groups } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getUserTestimonials, getUserProject } from "@/lib/testimonials"

export default async function TestimonialsPage() {
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

  // Get user's project and testimonials using shared utilities
  const userProject = await getUserProject(session.user.id);
  const testimonialsData = await getUserTestimonials(session.user.id);

  // Get groups for this project
  let projectGroups: Array<{ id: string; name: string; color: string }> = [];
  if (userProject) {
    const groupsData = await db
      .select({
        id: groups.id,
        name: groups.name,
        color: groups.color,
      })
      .from(groups)
      .where(eq(groups.projectId, userProject.id))
      .orderBy(groups.createdAt);

    // Transform groups to ensure color is never null
    projectGroups = groupsData.map(group => ({
      ...group,
      color: group.color || '#3B82F6' // Provide default color if null
    }));
  }

  // Show empty state if no testimonials
  if (testimonialsData.length === 0) {
    return (
      <EmptyState
        title="😬 Oops! Nothing here 😬 "
        description="You currently do not have any testimonials yet. Import or Request a few today!"
        actionLabel="Import testimonials"
      />
    )
  }

  // Show table with testimonials
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Testimonials</h1>
            <p className="text-muted-foreground">
              Manage and review customer testimonials
              <span className="block text-sm mt-1">
                Project: <span className="font-medium">{userProject?.name}</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <TestimonialsView
        data={testimonialsData}
        groups={projectGroups}
        projectId={userProject?.id || null}
      />
    </div>
  )
}