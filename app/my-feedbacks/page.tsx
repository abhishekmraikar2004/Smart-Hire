import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getFeedbackByUserId } from "@/lib/actions/general.action";

export default async function MyFeedbacks() {
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

  // Fetch user's feedback reports
  const userFeedback = await getFeedbackByUserId({ userId: user.id });
  const hasFeedback = userFeedback && userFeedback.length > 0;

  return (
    <main className="p-6 md:p-10 flex flex-col gap-10">
      {/* ---------------- HEADER ---------------- */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">My Feedback Reports</h1>
          <Button asChild className="btn-secondary">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
        <p className="text-lg text-gray-600">
          Review your interview performance and get insights to improve.
        </p>
      </section>

      {/* ---------------- MY FEEDBACK ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">Your Feedback Reports</h2>
        <div className="feedback-section grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hasFeedback ? (
            userFeedback?.map((feedback) => (
              <div key={feedback.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Interview: {feedback.interviewId}</h3>
                  <span className="text-sm text-gray-500">
                    Score: {feedback.totalScore}/100
                  </span>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Category Scores:</h4>
                  <div className="space-y-1">
                    {feedback.categoryScores.map((category, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{category.name}:</span>
                        <span className="font-medium">{category.score}/100</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Strengths:</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">Areas for Improvement:</h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {feedback.areasForImprovement.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Final Assessment:</h4>
                  <p className="text-sm text-gray-700">{feedback.finalAssessment}</p>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Completed: {new Date(feedback.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No feedback reports available yet.</p>
              <p className="text-gray-500 mt-2">Complete an interview to receive your first feedback report.</p>
              <div className="mt-6">
                <Button asChild className="btn-primary">
                  <Link href="/take-interview">Take an Interview</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- QUICK ACTIONS ---------------- */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-2">Take Another Interview</h3>
            <p className="text-gray-600 mb-4">
              Practice more interviews to improve your skills.
            </p>
            <Button asChild className="btn-primary">
              <Link href="/take-interview">Take Interview</Link>
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
