"use server";

import { cookies } from "next/headers";
import { auth, db } from "@/firebase/admin";

const ONE_WEEK = 60 * 60 * 24 * 7; // 1 week in seconds

// ---------------- SIGN UP ----------------
export async function signUp(params: SignUpParams) {
  const { uid, name, email, role } = params;

  try {
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    await userRef.set({ name, email, role });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use.",
      };
    }

    return {
      success: false,
      message: "Failed to create an account.",
    };
  }
}

// ---------------- SIGN IN ----------------
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Please create an account instead.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Signed in successfully.",
    };
  } catch (error) {
    console.error("Sign-in error:", error);
    return {
      success: false,
      message: "Failed to log in to an account.",
    };
  }
}

// ---------------- SET SESSION COOKIE ----------------
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies(); // ✅ Must await cookies()
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// ---------------- GET CURRENT USER ----------------
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies(); // ✅ Fixed: added await
  const session = cookieStore.get("session")?.value;

  if (!session) return null;

  try {
    const decoded = await auth.verifySessionCookie(session, true);
    const userDoc = await db.collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) return null;

    return {
      id: userDoc.id,
      ...(userDoc.data() as { name: string; email: string; role: 'admin' | 'candidate' }),
    };
  } catch (error) {
    console.error("Error verifying session:", error);
    return null;
  }
}

// ---------------- CHECK AUTHENTICATION ----------------
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

// ---------------- GET INTERVIEWS BY USER ID ----------------
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    const snapshot = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}
export async function getLatestInterviewsByUserId(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
    try {
        const { userId, limit = 20 } = params;
    const snapshot = await db
        .collection("interviews")
         .orderBy("createdAt", "desc")
         .where("finalized", "==", true)
        .where('userId', '!=', userId)
        .limit(limit)
      .get();

    if (snapshot.empty) return [];

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}
