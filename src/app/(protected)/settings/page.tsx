import { SettingsView } from "@/components/settings/settings-view"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getUserProject } from "@/lib/testimonials"

export default async function SettingsPage() {
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

  return (
    <div className="flex flex-col gap-6 py-6 md:gap-8 md:py-8">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your project settings and preferences
            </p>
          </div>
        </div>
      </div>

      <SettingsView project={userProject} />
    </div>
  )
}