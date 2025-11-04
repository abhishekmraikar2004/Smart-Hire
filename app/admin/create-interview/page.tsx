import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import CreateInterviewForm from "@/components/CreateInterviewForm";

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

      {/* ---------------- CREATE FORM ---------------- */}
      <section className="flex flex-col gap-6">
        <CreateInterviewForm user={user} />
      </section>
    </main>
  );
}
