import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users, groups } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getUserProject, getUserTestimonials } from "@/lib/testimonials"

import data from "./data.json"

export default async function DashboardPage() {
  // Validate session on the server - this is the secure approach
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
    // On error, redirect to onboarding to be safe
    redirect("/onboarding");
  }

  // Get user's project and testimonials data
  const userProject = await getUserProject(session.user.id);
  const testimonialsData = await getUserTestimonials(session.user.id);

  // Get groups data
  let groupsData: Array<{ id: string; name: string; color: string }> = [];
  if (userProject) {
    const projectGroups = await db
      .select({
        id: groups.id,
        name: groups.name,
        color: groups.color,
      })
      .from(groups)
      .where(eq(groups.projectId, userProject.id))
      .orderBy(groups.createdAt);

    groupsData = projectGroups.map(group => ({
      ...group,
      color: group.color || '#3B82F6'
    }));
  }

  // Calculate dashboard metrics
  const totalTestimonials = testimonialsData.length;
  const approvedTestimonials = testimonialsData.filter(t => t.status === 'approved');
  const totalApproved = approvedTestimonials.length;
  const totalGroups = groupsData.length;

  // Calculate average rating from approved testimonials
  const ratingsSum = approvedTestimonials.reduce((sum, t) => sum + (t.rating || 0), 0);
  const averageRating = totalApproved > 0 ? (ratingsSum / totalApproved) : 0;

  // Calculate recent activity (testimonials from last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentTestimonials = testimonialsData.filter(t =>
    new Date(t.createdAt) >= thirtyDaysAgo
  ).length;

  // Calculate trends (simple comparison - you can enhance this later)
  const approvalRate = totalTestimonials > 0 ? (totalApproved / totalTestimonials) * 100 : 0;

  const dashboardStats = {
    totalTestimonials,
    totalApproved,
    totalGroups,
    averageRating,
    recentTestimonials,
    approvalRate
  };

  return (
    <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
      {/* Header */}
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Overview of your testimonials and performance metrics
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <SectionCards stats={dashboardStats} />

      {/* Chart */}
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      {/* Data Table */}
      <DataTable data={data} />
    </div>
  )
}
