import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Return the current session (auth.js handles refresh automatically)
    return NextResponse.json({ 
      message: "Session refreshed",
      session: {
        user: session.user,
        expires: session.expires
      }
    });
  } catch (error) {
    console.error("Auth refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh session" },
      { status: 500 }
    );
  }
}
