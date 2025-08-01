import { TestimonialsTable } from "@/components/testimonials/testimonials-table"
import { EmptyState } from "@/components/empty-state"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, projects, testimonials } from "@/db/schema"
import { eq } from "drizzle-orm"

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

  // Get user's project
  let userProject = null;
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, session.user.id))
      .limit(1);

    userProject = project[0] || null;
  } catch (error) {
    console.error('Error fetching user project:', error);
  }

  // Get testimonials for the user's project
  let testimonialsData: any[] = [];
  if (userProject) {
    try {
      // TEMPORARY: Using fake UUID to test empty state
      const fakeProjectId = "00000000-0000-0000-0000-000000000000";

      testimonialsData = await db
        .select({
          id: testimonials.id,
          customerName: testimonials.customerName,
          customerEmail: testimonials.customerEmail,
          customerCompany: testimonials.customerCompany,
          customerTitle: testimonials.customerTitle,
          content: testimonials.content,
          rating: testimonials.rating,
          status: testimonials.status,
          source: testimonials.source,
          tags: testimonials.tags,
          createdAt: testimonials.createdAt,
          approvedAt: testimonials.approvedAt,
        })
        .from(testimonials)
        .where(eq(testimonials.projectId, fakeProjectId)) // This will return no results
        .orderBy(testimonials.createdAt);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }


  // Show empty state if no testimonials
  if (testimonialsData.length === 0) {
    return (
      <EmptyState
        title="No testimonials found"
        description="Testimonials you collect will show up here. Already got testimonials? Import them!"
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

      <TestimonialsTable
        data={testimonialsData}
        projectId={userProject?.id || null}
      />
    </div>
  )
}