import { db } from "@/firebase/admin";
import React from "react";

export default async function AdminDashboard() {
  if (!db) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
        <p className="text-gray-500">Database not available.</p>
      </div>
    );
  }

  const snapshot = await db
    .collection("feedbacks")
    .orderBy("createdAt", "desc")
    .get();

  const feedbacks = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.candidateName || "Unknown Candidate",
      score: data.score || 0,
      feedback: data.feedback || "No feedback available",
    };
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">All Feedback</h1>
      {feedbacks.map((f) => (
        <div key={f.id} className="border p-4 rounded-lg mb-3">
          <h2 className="font-semibold text-lg">{f.name}</h2>
          <p className="text-gray-700 mt-2">Score: {f.score}</p>
          <p className="mt-2">{f.feedback}</p>
        </div>
      ))}
    </div>
  );
}
