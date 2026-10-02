"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  RotateCw,
  ShieldQuestion,
} from "lucide-react"

type Step = "credentials" | "otp"

export default function AdminLoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [step, setStep] = useState<Step>("credentials")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState<string | null>(null)
  const [secretAnswer, setSecretAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (session?.user?.role === "ADMIN") {
      redirect("/admin")
    }
  }, [session, status])

  const requestOtp = async () => {
    setError(null)
    setInfo(null)
    if (!email || !password) {
      setError("Please enter your email and password")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to send OTP. Try again.")
        return
      }
      setInfo(data.message || "OTP sent to your email")
      setSecurityQuestion(data.requiresSecurityQuestion ? data.securityQuestion || null : null)
      setSecretAnswer("")
      setOtp("")
      setStep("otp")
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCredentials = async (e: FormEvent) => {
    e.preventDefault()
    await requestOtp()
  }

  const handleResend = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not resend OTP")
        return
      }
      setInfo(data.message || "A new OTP has been sent to your email")
      setOtp("")
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (otp.length < 6) {
      setError("Please enter the full 6-character OTP")
      return
    }
    if (securityQuestion && !secretAnswer.trim()) {
      setError("Please answer the security question")
      return
    }
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        otp,
        secret: securityQuestion ? secretAnswer : undefined,
        redirect: false,
        callbackUrl: "/admin",
      })
      if (result?.error) {
        const code = (result as { code?: string }).code
        setError(
          code === "expired_otp"
            ? "OTP has expired. Please request a new one."
            : code === "invalid_otp"
              ? "Invalid OTP. Check your email and try again."
              : code === "invalid_security_answer"
                ? "Security answer is incorrect."
                : "Login failed. Please check your email and password."
        )
        if (code !== "invalid_security_answer") {
          setStep("credentials")
        }
        return
      }
      router.push("/admin")
      router.refresh()
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-red-600/15 via-background to-pink-600/15 px-4 py-10">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-pink-600 shadow-lg">
            <span className="text-lg font-black text-white">YB</span>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Console</CardTitle>
          <CardDescription>
            {step === "credentials"
              ? "Restricted access — sign in with your admin credentials"
              : securityQuestion
                ? "Enter the OTP and answer your security question"
                : "Enter the OTP sent to your email — it contains A–Z, a–z, 0–9"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {info && (
            <div className="mb-4 flex items-start gap-2 rounded-lg bg-primary/10 p-3 text-sm text-primary">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{info}</span>
            </div>
          )}

          {step === "credentials" ? (
            <form onSubmit={handleCredentials} className="space-y-4">
              <div className="flex items-center justify-center gap-2 rounded-lg bg-primary/5 p-3 text-center text-xs text-muted-foreground">
                <ShieldQuestion className="h-4 w-4 shrink-0 text-primary" />
                This area is for administrators only. Student logins use the public sign-in page.
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Admin Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@yuva-bot.com"
                    className="pl-9"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    className="pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                {loading ? "Sending OTP…" : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                OTP sent to <span className="font-medium text-foreground">{email}</span>
              </p>

              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-12 w-10 text-lg sm:w-11" />
                    <InputOTPSlot index={1} className="h-12 w-10 text-lg sm:w-11" />
                    <InputOTPSlot index={2} className="h-12 w-10 text-lg sm:w-11" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} className="h-12 w-10 text-lg sm:w-11" />
                    <InputOTPSlot index={4} className="h-12 w-10 text-lg sm:w-11" />
                    <InputOTPSlot index={5} className="h-12 w-10 text-lg sm:w-11" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {securityQuestion ? (
                <div className="space-y-1.5 rounded-lg border bg-primary/5 p-4">
                  <Label htmlFor="secret" className="text-sm font-semibold">
                    Security Question
                  </Label>
                  <p className="text-sm text-foreground">{securityQuestion}</p>
                  <Input
                    id="secret"
                    type="text"
                    autoComplete="off"
                    placeholder="Your secret answer"
                    className="mt-2"
                    value={secretAnswer}
                    onChange={(e) => setSecretAnswer(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <p className="rounded-lg bg-primary/5 p-3 text-center text-xs text-muted-foreground">
                  Tip: add a secret question via <span className="font-medium">Admin → Settings</span>{" "}
                  for an extra login check.
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? "Verifying…" : "Verify & Sign In"}
              </Button>

              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="mx-auto flex items-center gap-1.5 text-sm text-primary hover:underline disabled:opacity-50"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Resend OTP
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("credentials")
                  setError(null)
                  setInfo(null)
                }}
                className="mx-auto block text-sm text-muted-foreground hover:text-foreground"
              >
                ← Change email / password
              </button>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Students?{" "}
            <Link href="/auth/signin" className="font-medium text-primary hover:underline">
              Sign in here
            </Link>
          </p>
          <Link href="/" className="text-xs text-muted-foreground hover:underline">
            ← Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}