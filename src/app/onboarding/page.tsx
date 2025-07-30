import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default async function OnboardingPage() {
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
    
    // If user has already completed onboarding, redirect to dashboard
    if (onboardingCompleted) {
      redirect("/dashboard");
    }
  } catch (error) {
    // Check if it's a redirect error (which is expected)
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      // This is a redirect, re-throw it
      throw error;
    }
    console.error('Error checking onboarding status:', error);
    // On other errors, allow them to stay on onboarding page
  }

  return <OnboardingFlow />;
}