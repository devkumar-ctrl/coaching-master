import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { auth } from "@/auth";
import { hashPassword, normalizeEmail } from "@/lib/password";

export const runtime = "nodejs";

// POST /api/auth/admin/set-security - Admin sets/updates their secret question
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const email = normalizeEmail(String(body?.email || ""));
    const securityQuestion = String(body?.securityQuestion || "").trim();
    const answer = String(body?.answer || "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (securityQuestion.length < 3) {
      return NextResponse.json({ error: "Please choose or enter a security question" }, { status: 400 });
    }
    if (answer.length < 2) {
      return NextResponse.json({ error: "Security answer must be at least 2 characters" }, { status: 400 });
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only allow an admin to configure their own secret question
    if (String(user.id) !== String(session.user.id)) {
      return NextResponse.json({ error: "You can only configure your own security question" }, { status: 403 });
    }

    // Store the question in plain text (displayed at login) and the answer hashed
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          securityQuestion,
          securityAnswerHash: hashPassword(answer.toLowerCase()),
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Security question saved.",
    });
  } catch (error) {
    console.error("Error setting security question:", error);
    return NextResponse.json({ error: "Failed to save security question" }, { status: 500 });
  }
}