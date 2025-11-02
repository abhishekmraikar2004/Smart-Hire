import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

export default async function UserDashboard() {
  // ✅ Fetch currently logged-in user
  const user = await getCurrentUser();

  // ✅ If user not logged in or not candidate → show access denied
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

  // ✅ Fetch user interviews and available interviews in parallel
  const [userInterviews, allInterviews] = await Promise.all([
    getInterviewsByUserId(user.id), // This now filters by role internally
    getLatestInterviews({ userId: user.id }),
  ]);

  const hasPastInterviews = (userInterviews?.length ?? 0) > 0;
  const hasUpcomingInterviews = (allInterviews?.length ?? 0) > 0;

  return (
    <div className="space-y-8">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="card-cta flex flex-col md:flex-row items-center justify-between gap-6 bg-white rounded-2xl shadow p-8">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2 className="text-3xl font-bold text-gray-800">
            Get Interview-Ready with AI-Powered Practice & Feedback
          </h2>
          <p className="text-lg text-gray-600">
            Practice real interview questions and get instant AI-driven feedback
            to improve your confidence.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="AI Interview Assistant Robot"
          width={400}
          height={400}
          className="max-sm:hidden"
          priority
        />
      </section>

      {/* ---------------- USER'S INTERVIEWS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">Your Completed Interviews</h2>
        <div className="interviews-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
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
            <p className="text-gray-600">
              You haven't taken any interviews yet.
            </p>
          )}
        </div>
      </section>

      {/* ---------------- AVAILABLE INTERVIEWS ---------------- */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Available Interviews
        </h2>
        <div className="interviews-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasUpcomingInterviews ? (
            allInterviews?.map((interview) => (
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
            <p className="text-gray-600">
              There are currently no interviews available.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
