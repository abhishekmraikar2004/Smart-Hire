'use server';
import {db} from "@/firebase/admin";
import {generateObject} from "ai";
import {google} from "@ai-sdk/google";
import {feedbackSchema} from "@/constants";
import { getCurrentUser } from "./auth.action";

export async function getInterviewsByUserId(userId:string): Promise<Interview[] | null> {
    if (!userId) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    if (!db) return null;

    let query: any = db.collection('interviews');

    if (user.role === 'candidate') {
        // Candidates see only interviews assigned to them
        query = query.where('assignedTo', '==', userId).where('finalized','==', true);
    } else if (user.role === 'admin') {
        // Admins see all finalized interviews
        query = query.where('finalized','==', true);
    } else {
        return null;
    }

    const interviews = await query.get();

    const sortedDocs = interviews.docs.sort((a: any, b: any) => new Date(b.data().createdAt).getTime() - new Date(a.data().createdAt).getTime());

    return sortedDocs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getLatestInterviews(params:GetLatestInterviewsParams): Promise<Interview[] | null> {
    const {userId, limit = 20} = params;

    if (!userId) return null;

    if (!db) return null;

    const interviews = await db
        .collection('interviews')
        .where('finalized', '==', false)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getInterviewById(id:string): Promise<Interview | null> {
    if (!db) return null;

    const interview = await db
        .collection('interviews')
        .doc(id)
        .get();

    return interview.data() as Interview| null;
}

export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;

    if (!db) return { success: false };

    try {
        // Fetch user details
        const userDoc = await db.collection("users").doc(userId).get();
        if (!userDoc.exists) {
            console.error("User not found");
            return { success: false };
        }
        const userData = userDoc.data();

        // Fetch interview details
        const interviewDoc = await db.collection("interviews").doc(interviewId).get();
        if (!interviewDoc.exists) {
            console.error("Interview not found");
            return { success: false };
        }
        const interviewData = interviewDoc.data();

        const formattedTranscript = transcript
            .map(
                (sentence: { role: string; content: string }) =>
                    `- ${sentence.role}: ${sentence.content}\n`
            ).join("");

        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001"),
            schema: feedbackSchema,
            prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
            system:
                "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
        });

        // Transform categoryScores from object to array format
        const categoryScoresArray = [
            {
                name: "Communication Skills",
                score: object.categoryScores.communication.score,
                comment: object.categoryScores.communication.feedback,
            },
            {
                name: "Technical Knowledge",
                score: object.categoryScores.technicalKnowledge.score,
                comment: object.categoryScores.technicalKnowledge.feedback,
            },
            {
                name: "Problem-Solving",
                score: object.categoryScores.problemSolving.score,
                comment: object.categoryScores.problemSolving.feedback,
            },
            {
                name: "Cultural & Role Fit",
                score: object.categoryScores.culturalFit.score,
                comment: object.categoryScores.culturalFit.feedback,
            },
            {
                name: "Confidence & Clarity",
                score: object.categoryScores.confidence.score,
                comment: object.categoryScores.confidence.feedback,
            },
        ];

        const feedback = {
            interviewId: interviewId,
            userId: userId,
            candidateName: userData?.name || "Unknown",
            candidateEmail: userData?.email || "Unknown",
            interviewRole: interviewData?.role || "Unknown",
            totalScore: object.totalScore,
            categoryScores: categoryScoresArray,
            strengths: object.strengths,
            areasForImprovement: object.areasForImprovement,
            finalAssessment: object.finalAssessment,
            createdAt: new Date().toISOString(),
        };

        let feedbackRef;

        if (feedbackId) {
            feedbackRef = db.collection("feedback").doc(feedbackId);
        } else {
            feedbackRef = db.collection("feedback").doc();
        }

        await feedbackRef.set(feedback);

        await db.collection("interviews").doc(interviewId).update({
            finalized: true,
            totalScore: object.totalScore,
            createdAt: new Date().toISOString(),
        });

        console.log("✅ Feedback saved & interview updated:", feedbackRef.id);

        return { success: true, feedbackId: feedbackRef.id };
    } catch (error) {
        console.error("❌ Error saving feedback:", error);
        return { success: false };
    }
}
export async function getFeedbackByInterviewId(params:GetFeedbackByInterviewIdParams): Promise<Feedback | null> {
    const {interviewId, userId} = params;

    const user = await getCurrentUser();
    if (!user) return null;

    if (!db) return null;

    let query = db.collection('feedback').where('interviewId', '==', interviewId);

    if (user.role === 'candidate') {
        // Candidates can only see their own feedback
        query = query.where('userId', '==', userId);
    }
    // Admins can see all feedback

    const feedback = await query.limit(1).get();

    if (feedback.empty) return null;

    const feedbackDoc = feedback.docs[0];

    return {
        id: feedbackDoc.id, ...feedbackDoc.data()
    } as Feedback;

}

export async function getFeedbackByUserId(params: { userId: string }): Promise<Feedback[] | null> {
    const { userId } = params;

    const user = await getCurrentUser();
    if (!user) return null;

    if (!db) return null;

    let query = db.collection('feedback').orderBy('createdAt', 'desc');

    if (user.role === 'candidate') {
        // Candidates can only see their own feedback
        query = query.where('userId', '==', userId);
    }
    // Admins can see all feedback

    const feedback = await query.get();

    if (feedback.empty) return [];

    return feedback.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Feedback[];
}

export async function getAllInterviews(): Promise<Interview[] | null> {
    if (!db) return null;

    const interviews = await db
        .collection('interviews')
        .orderBy('createdAt', 'desc')
        .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Interview[];
}

export async function getAllFeedback(): Promise<Feedback[] | null> {
    if (!db) return null;

    const feedback = await db
        .collection('feedback')
        .orderBy('createdAt', 'desc')
        .get();

    return feedback.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Feedback[];
}
