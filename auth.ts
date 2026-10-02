import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getDatabase } from "@/lib/db";
import {
  verifyPassword,
  verifyOtpHash,
  normalizeEmail,
} from "@/lib/password";

class InvalidOtpError extends CredentialsSignin {
  code = "invalid_otp";
}

class ExpiredOtpError extends CredentialsSignin {
  code = "expired_otp";
}

class InvalidSecurityAnswerError extends CredentialsSignin {
  code = "invalid_security_answer";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  // JWT-based sessions so the frontend can read role/id without a DB round-trip
  session: {
    strategy: "jwt",
  },
  // Required when self-hosted (custom domain / non-Vercel)
  trustHost: true,

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },

  providers: [
    Credentials({
      name: "Email + Password + OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
        secret: { label: "Security Answer", type: "text" },
      },
      async authorize(credentials) {
        const email = normalizeEmail(String(credentials?.email || ""));
        const password = String(credentials?.password || "");
        const otp = String(credentials?.otp || "");
        const secret = String(credentials?.secret || "").trim().toLowerCase();

        if (!email || !password || !otp) return null;

        const db = await getDatabase();
        const user = await db.collection("users").findOne({ email });

        // User must exist AND have a password set
        if (!user || typeof user.passwordHash !== "string") return null;

        // Step 1: correct password?
        if (!verifyPassword(password, user.passwordHash)) return null;

        // Step 2: matching, unexpired OTP?
        const now = new Date();
        const record = await db.collection("otps").findOne({
          email,
          verified: false,
          expiresAt: { $gt: now },
        });

        if (!record) throw new ExpiredOtpError();

        if (!verifyOtpHash(otp, record.otpHash)) {
          await db.collection("otps").updateOne(
            { _id: record._id },
            { $inc: { attempts: 1 } }
          );
          throw new InvalidOtpError();
        }

        // Step 3 (ADMIN ONLY): after password + OTP, require the security answer.
        // Admins without a configured question can still log in once so they can
        // set it from Admin -> Settings.
        if (user.role === "ADMIN" && user.securityQuestion && typeof user.securityAnswerHash === "string") {
          if (!secret || !verifyPassword(secret, user.securityAnswerHash)) {
            throw new InvalidSecurityAnswerError();
          }
        }

        // Consume the OTP (one-time use)
        await db.collection("otps").updateOne(
          { _id: record._id },
          { $set: { verified: true } }
        );

        return {
          id: user.id || String(user._id),
          name: user.name,
          email: user.email,
          image: user.image || null,
          role: user.role || "STUDENT",
        };
      },
    }),
  ],

  callbacks: {
    // Attach role/id to the JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? "STUDENT";
        token.id = user.id;
      }
      return token;
    },

    // Expose role/id in the session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = token.role as "STUDENT" | "COACH" | "ADMIN" | undefined;
      }
      return session;
    },
  },
});