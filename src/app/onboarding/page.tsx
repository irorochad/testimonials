import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  // Validate session on the server - this is the secure approach
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // If no valid session, redirect to login
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to ProofFlow!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's get you set up with your first testimonial project
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Hello, {session.user.name}!
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Email: {session.user.email}
              </p>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                This is your onboarding page. Here you would typically:
              </p>
              <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Set up your first testimonial project</li>
                <li>Configure your website details</li>
                <li>Choose collection methods</li>
                <li>Customize your widget</li>
              </ul>
            </div>
            
            <div className="pt-4">
              <a
                href="/dashboard"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Continue to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}