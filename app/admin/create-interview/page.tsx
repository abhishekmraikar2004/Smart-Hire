import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

export default async function CreateInterview() {
  // Fetch currently logged-in user
  const user = await getCurrentUser();

  // If user not logged in or not admin → redirect to sign-in
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be an admin to access this page.
        </p>
        <Button asChild className="btn-primary">
          <Link href="/admin-sign-in">Go to Admin Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="p-6 md:p-10 flex flex-col gap-10">
      {/* ---------------- HEADER ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Create Interview Set</h1>
          <Button asChild className="btn-secondary">
            <Link href="/admin/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Create a new interview set for candidates to practice.
        </p>
      </section>

      {/* ---------------- CREATE FORM PLACEHOLDER ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interview Details</h2>
          <p className="text-gray-600 mb-6">
            This is a placeholder for the interview creation form. In a full implementation,
            you would have fields for role, level, tech stack, number of questions, etc.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Role</label>
              <input
                type="text"
                placeholder="e.g., Frontend Developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack</label>
              <input
                type="text"
                placeholder="e.g., React, TypeScript, Node.js"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
              <input
                type="number"
                placeholder="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled
              />
            </div>
          </div>
          <div className="mt-6">
            <Button className="btn-primary" disabled>
              Create Interview Set
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
