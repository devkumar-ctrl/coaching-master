import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { auth } from "@/auth";
import { hashPassword, normalizeEmail } from "@/lib/password";

export const runtime = "nodejs";

// POST /api/auth/admin/set-password - Admin sets/resets a password for any user
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const email = normalizeEmail(String(body?.email || ""));
    const password = String(body?.password || "");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          passwordHash: hashPassword(password),
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Password set for ${email}`,
    });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }
}