import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import {
  generateOtp,
  hashOtp,
  verifyPassword,
  normalizeEmail,
  OTP_TTL_MS,
  OTP_MAX_SENDS,
} from "@/lib/password";
import { sendOtpEmail } from "@/lib/email";

export const runtime = "nodejs";

// POST /api/auth/send-otp - Verify email+password, then email a login OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = normalizeEmail(String(body?.email || ""));
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const db = await getDatabase();
    const user = await db.collection("users").findOne({ email });

    // Same message whether user is missing or password is wrong (no enumeration)
    if (!user || typeof user.passwordHash !== "string" || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const now = new Date();

    // Rate limit: max N unverified OTPs in flight per email
    const recentCount = await db.collection("otps").countDocuments({
      email,
      verified: false,
      createdAt: { $gt: new Date(now.getTime() - OTP_TTL_MS) },
    });
    if (recentCount >= OTP_MAX_SENDS) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait a few minutes." },
        { status: 429 }
      );
    }

    // Invalidate any stale unverified OTPs for this email
    await db.collection("otps").updateMany(
      { email, verified: false },
      { $set: { verified: true, invalidatedAt: now } }
    );

    const otp = generateOtp(6);

    const sent = await sendOtpEmail(user.name || "User", email, otp);
    if (!sent.success) {
      console.error("OTP email failed:", sent.error);
      return NextResponse.json({ error: "Failed to send OTP email. Please try again." }, { status: 500 });
    }

    await db.collection("otps").insertOne({
      email,
      otpHash: hashOtp(otp),
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      createdAt: now,
      verified: false,
      attempts: 0,
    });

    // Admin accounts also require answering their secret question after the OTP.
    // Only reveal this to someone who already proved email + password.
    const isAdmin = user.role === "ADMIN";
    const securityQuestion = isAdmin && user.securityQuestion
      ? String(user.securityQuestion)
      : null;

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email",
      expirySeconds: Math.floor(OTP_TTL_MS / 1000),
      requiresSecurityQuestion: isAdmin,
      securityQuestion,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}