import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { auth } from "@/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

// POST /api/auth/change-password - Authenticated user changes their own password
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = String(body?.currentPassword || "");
    const newPassword = String(body?.newPassword || "");

    if (!currentPassword) {
      return NextResponse.json({ error: "Current password is required" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) });

    if (
      !user ||
      typeof user.passwordHash !== "string" ||
      !verifyPassword(currentPassword, user.passwordHash)
    ) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
    }

    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash: hashPassword(newPassword),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
  }
}