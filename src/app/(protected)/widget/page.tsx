import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WidgetTemplates } from "@/components/widget/widget-templates";

export default async function WidgetPage() {
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
    console.error('Error checking onboarding status:', error);
    redirect("/onboarding");
  }

  return (
    // <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <WidgetTemplates />
    </div>
  );
}