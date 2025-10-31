import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getAllInterviews, getAllFeedback } from "@/lib/actions/general.action";

export default async function AdminDashboard() {
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
          <Link href="/sign-in">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  // Fetch all interviews and feedback for admin
  const [allInterviews, allFeedback] = await Promise.all([
    getAllInterviews(),
    getAllFeedback(),
  ]);

  const hasInterviews = (allInterviews?.length ?? 0) > 0;
  const hasFeedback = (allFeedback?.length ?? 0) > 0;

  return (
    <main className="p-6 md:p-10 flex flex-col gap-10">
      {/* ---------------- HEADER ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Button asChild className="btn-primary">
            <Link href="/admin/create-interview">Create New Interview</Link>
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Manage interviews, assign to candidates, and view all feedback.
        </p>
      </section>

      {/* ---------------- ALL INTERVIEWS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Interviews</h2>
        <div className="interviews-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasInterviews ? (
            allInterviews?.map((interview) => (
              <InterviewCard
                key={interview.id}
                id={interview.id}
                userId={interview.userId}
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

      {/* ---------------- ALL FEEDBACK ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">All Feedback</h2>
        <div className="feedback-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasFeedback ? (
            allFeedback?.map((feedback) => (
              <div key={feedback.id} className="card p-4">
                <h3 className="font-semibold">{feedback.interviewId}</h3>
                <p className="text-sm text-gray-600">Score: {feedback.totalScore}</p>
                <p className="text-sm">{feedback.finalAssessment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No feedback available.</p>
          )}
        </div>
      </section>
    </main>
  );
}
