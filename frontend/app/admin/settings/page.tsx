"use client";

import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle, KeyRound, Loader2, Lock, ShieldQuestion } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";

const SECURITY_QUESTIONS = [
  "What is your pet's name?",
  "What is the name of your school?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What is the name of your favourite teacher?",
  "Which city were you born in?",
];

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [secChoice, setSecChoice] = useState("");
  const [secCustom, setSecCustom] = useState("");
  const [secAnswer, setSecAnswer] = useState("");
  const [secConfirmAnswer, setSecConfirmAnswer] = useState("");
  const [loadingSec, setLoadingSec] = useState(false);
  const [errorSec, setErrorSec] = useState<string | null>(null);
  const [successSec, setSuccessSec] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    redirect("/adm_n/login");
  } else if (session.user?.role !== "ADMIN") {
    redirect("/auth/signin");
  }

  const handleSecuritySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorSec(null);
    setSuccessSec(null);

    const question =
      secChoice === "__custom__" ? secCustom.trim() : secChoice.trim();
    if (question.length < 3) {
      setErrorSec("Please pick or enter a security question");
      return;
    }
    if (secAnswer.trim().length < 2) {
      setErrorSec("Security answer must be at least 2 characters");
      return;
    }
    if (secAnswer.trim().toLowerCase() !== secConfirmAnswer.trim().toLowerCase()) {
      setErrorSec("Answers do not match");
      return;
    }

    setLoadingSec(true);
    try {
      const res = await fetch("/api/auth/admin/set-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user?.email,
          securityQuestion: question,
          answer: secAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorSec(data.error || "Failed to save security question");
        return;
      }
      setSuccessSec("Security question saved. You will be asked this at admin login.");
      setSecAnswer("");
      setSecConfirmAnswer("");
    } catch {
      setErrorSec("Network error — please try again.");
    } finally {
      setLoadingSec(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user?.email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update password");
        return;
      }
      setSuccess("Password updated successfully.");
      setPassword("");
      setConfirm("");
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Settings"
        description="Manage your account password and login security."
      />

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white shadow">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update the password for{" "}
                <span className="font-medium text-foreground">{session.user?.email}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={session.user?.email || ""} disabled />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Minimum 6 characters"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat the new password"
                  className="pl-9"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            You will use the new password the next time you sign in. Your OTP is still sent to your
            email for two-factor verification.
          </p>
        </CardContent>
      </Card>

      <Card className="mt-8 border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-pink-600 text-white shadow">
              <ShieldQuestion className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Security Question</CardTitle>
              <CardDescription>
                Extra login check for admin accounts — asked after your password and OTP.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {errorSec && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorSec}</span>
            </div>
          )}
          {successSec && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{successSec}</span>
            </div>
          )}

          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sec-question">Choose a question</Label>
              <Select value={secChoice} onValueChange={setSecChoice} required>
                <SelectTrigger id="sec-question" className="w-full">
                  <SelectValue placeholder="Select a security question" />
                </SelectTrigger>
                <SelectContent>
                  {SECURITY_QUESTIONS.map((q) => (
                    <SelectItem key={q} value={q}>
                      {q}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">Custom question…</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {secChoice === "__custom__" && (
              <div className="space-y-1.5">
                <Label htmlFor="sec-custom">Your question</Label>
                <Input
                  id="sec-custom"
                  type="text"
                  placeholder="e.g. What was your first car's name?"
                  value={secCustom}
                  onChange={(e) => setSecCustom(e.target.value)}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="sec-answer">Answer</Label>
              <Input
                id="sec-answer"
                type="text"
                autoComplete="off"
                placeholder="Your secret answer"
                value={secAnswer}
                onChange={(e) => setSecAnswer(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sec-confirm">Confirm Answer</Label>
              <Input
                id="sec-confirm"
                type="text"
                autoComplete="off"
                placeholder="Repeat the answer"
                value={secConfirmAnswer}
                onChange={(e) => setSecConfirmAnswer(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loadingSec}
              className="w-full sm:w-auto gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              {loadingSec ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldQuestion className="h-4 w-4" />}
              {loadingSec ? "Saving…" : "Save Security Question"}
            </Button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground">
            The question is shown only after the correct password and OTP. The answer is stored
            hashed (never in plain text). You can change it anytime.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}