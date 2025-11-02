import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./firebase/admin";
import { db } from "./firebase/admin";

export async function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;

  // If not logged in → go to sign-in
  if (!session) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    if (!auth || !db) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Verify Firebase session
    const decoded = await auth.verifySessionCookie(session, true);
    const userDoc = await db.collection("users").doc(decoded.uid).get();
    const role = userDoc.data()?.role;

    const url = req.nextUrl.pathname;

    // Block admin pages from candidates
    if (url.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }

    // Block candidate pages from admins
    if (url.startsWith("/candidate") && role !== "candidate") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth failed:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

// Define protected routes
export const config = {
  matcher: [
    "/admin/:path*",
    "/candidate/:path*",
    "/interview/:path*",
    "/feedback/:path*",
  ],
};
