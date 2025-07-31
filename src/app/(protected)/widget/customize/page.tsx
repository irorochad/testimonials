import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function WidgetCustomizePage() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Widget Customization</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This is where the full customization interface will be built
          </p>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Coming Soon!</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The widget customization interface will include:
              </p>
              <ul className="text-left space-y-2 text-sm">
                <li>• Live preview of your widget</li>
                <li>• Color and theme customization</li>
                <li>• Layout and style options</li>
                <li>• Testimonial content management</li>
                <li>• Export and embed code generation</li>
                <li>• Save and share functionality</li>
              </ul>
              
              <div className="pt-4">
                <a 
                  href="/widget" 
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ← Back to Templates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}