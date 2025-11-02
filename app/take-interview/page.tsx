import Link from "next/link";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getLatestInterviews } from "@/lib/actions/general.action";

export default async function TakeInterview() {
  // Fetch currently logged-in user
  const user = await getCurrentUser();

  // If user not logged in or not candidate → redirect to sign-in
  if (!user || user.role !== 'candidate') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You need to be a candidate to access this page.
        </p>
        <Button asChild className="btn-primary">
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  // Fetch available interviews for candidates
  const availableInterviews = await getLatestInterviews({ userId: user.id });
  const hasAvailableInterviews = (availableInterviews?.length ?? 0) > 0;

  return (
    <main className="p-6 md:p-10 flex flex-col gap-10">
      {/* ---------------- HEADER ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Take Interview</h1>
          <Button asChild className="btn-secondary">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Select an available interview to practice and get AI-powered feedback.
        </p>
      </section>

      {/* ---------------- AVAILABLE INTERVIEWS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">Available Interviews</h2>
        <div className="interviews-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasAvailableInterviews ? (
            availableInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                userId={user.id}
                role={interview.role}
                type={interview.type}
                techstack={interview.techstack}
                createdAt={interview.createdAt}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No interviews available at the moment.</p>
              <p className="text-gray-500 mt-2">Check back later or contact your administrator.</p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- QUICK ACTIONS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">View My Feedback</h3>
            <p className="text-gray-600 mb-4">
              Review your previous interview performance and feedback.
            </p>
            <Button asChild className="btn-primary">
              <Link href="/my-feedbacks">View Feedback</Link>
            </Button>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Dashboard</h3>
            <p className="text-gray-600 mb-4">
              Go back to your main dashboard to see all your activities.
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
