import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

export default async function CandidateDashboard() {
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

  // Fetch assigned interviews and available interviews for candidate
  const [assignedInterviews, availableInterviews] = await Promise.all([
    getInterviewsByUserId(user.id), // This will be updated to filter by assignedTo
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasAssignedInterviews = (assignedInterviews?.length ?? 0) > 0;
  const hasAvailableInterviews = (availableInterviews?.length ?? 0) > 0;

  return (
    <main className="p-6 md:p-10 flex flex-col gap-10">
      {/* ---------------- HEADER ---------------- */}
      <section className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800">Candidate Dashboard</h1>
        <p className="text-lg text-gray-600">
          Take assigned interviews and view your feedback.
        </p>
      </section>

      {/* ---------------- ASSIGNED INTERVIEWS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Assigned Interviews</h2>
        <div className="interviews-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasAssignedInterviews ? (
            assignedInterviews?.map((interview) => (
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
            <p className="text-gray-600">No interviews assigned yet.</p>
          )}
        </div>
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
            <p className="text-gray-600">No interviews available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
