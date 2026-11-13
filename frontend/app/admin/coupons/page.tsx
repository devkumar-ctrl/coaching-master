"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Loader2, TicketPercent, Wand2, Copy } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"

interface CourseOption {
  id: string
  title: string
  price: number
}

interface Coupon {
  id: string
  code: string
  type: string
  value: number
  courseId: string
  courseTitle: string | null
  maxUses: number | null
  usedCount: number
  expiresAt: string | null
  isActive: boolean
}

const DISCOUNT_PRESETS = [10, 25, 50, 80, 90, 100]

function generateCode(prefix = "AB"): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let out = ""
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}${out}`
}

export default function AdminCouponsPage() {
  const { data: session, status } = useSession()

  const [courses, setCourses] = useState<CourseOption[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [courseId, setCourseId] = useState("")
  const [discount, setDiscount] = useState<number>(100)
  const [code, setCode] = useState("")
  const [maxUses, setMaxUses] = useState<string>("")
  const [expiresAt, setExpiresAt] = useState<string>("")
  const [isActive, setIsActive] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    try {
      const [coursesRes, couponsRes] = await Promise.all([
        fetch("/api/admin/courses"),
        fetch("/api/admin/coupons"),
      ])

      if (coursesRes.ok) {
        const data = await coursesRes.json()
        const list: CourseOption[] = (Array.isArray(data) ? data : []).map(
          (c: { _id: string; title: string; price: number }) => ({
            id: c._id,
            title: c.title,
            price: c.price,
          }),
        )
        setCourses(list)
      }

      if (couponsRes.ok) {
        const data = await couponsRes.json()
        setCoupons(Array.isArray(data) ? data : [])
      } else {
        const data = await couponsRes.json().catch(() => null)
        setError(data?.error || "Failed to load coupons")
      }
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "authenticated") {
      fetchAll()
    }
  }, [status, fetchAll])

  const role = (session as unknown as { user?: { role?: string } })?.user?.role
  const isAdmin = Boolean(session && role === "ADMIN")

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId],
  )

  const finalAmount = useMemo(() => {
    if (!selectedCourse) return 0
    const price = Number(selectedCourse.price) || 0
    return Math.max(0, Math.round((price * (100 - discount)) / 100))
  }, [selectedCourse, discount])

  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!session || !isAdmin) {
    redirect("/auth/signin")
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!courseId) {
      setError("Choose a course first.")
      return
    }

    const trimmedCode = code.trim() || generateCode()
    if (trimmedCode.length < 3) {
      setError("Coupon code must be at least 3 characters.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: trimmedCode,
          type: "percentage",
          value: discount,
          courseId,
          maxUses: maxUses ? Number(maxUses) : null,
          expiresAt: expiresAt || null,
          isActive,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to create coupon")
        return
      }

      setSuccess(
        discount === 100
          ? `Free coupon "${data.code}" created — students can enroll for ₹0.`
          : `Coupon "${data.code}" created for ${discount}% off.`,
      )
      setCode("")
      setMaxUses("")
      setExpiresAt("")
      await fetchAll()
    } catch {
      setError("Network error — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleCoupon = async (coupon: Coupon) => {
    setError(null)
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || "Failed to update coupon")
        return
      }
      await fetchAll()
    } catch {
      setError("Network error — please try again.")
    }
  }

  const deleteCoupon = async (coupon: Coupon) => {
    setError(null)
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "DELETE",
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.error || "Failed to delete coupon")
        return
      }
      await fetchAll()
    } catch {
      setError("Network error — please try again.")
    }
  }

  const copyCode = async (coupon: Coupon) => {
    try {
      await navigator.clipboard.writeText(coupon.code)
      setCopiedId(coupon.id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="Coupons"
        description="Generate course-specific discount coupons — 80% off, 90% off, or a 100% free pass."
      />

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow">
              <TicketPercent className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Create Coupon</CardTitle>
              <CardDescription>
                Pick a course, choose the discount, write or generate the code.
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

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="course">Course</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="course" aria-label="Choose course">
                  <SelectValue placeholder="Select a course…" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Discount</Label>
              <div className="flex flex-wrap gap-2">
                {DISCOUNT_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDiscount(preset)}
                    aria-pressed={discount === preset}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-fast ${
                      discount === preset
                        ? preset === 100
                          ? "border-green-600 bg-green-600/10 text-green-700"
                          : "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {preset === 100 ? "100% Free" : `${preset}% off`}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Label htmlFor="customDiscount" className="text-muted-foreground">
                  Custom %
                </Label>
                <Input
                  id="customDiscount"
                  type="number"
                  min={1}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-24"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="code">Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. FREE100"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCode(generateCode())}
                    aria-label="Generate random code"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="maxUses">Usage Limit</Label>
                <Input
                  id="maxUses"
                  type="number"
                  min={1}
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  placeholder="Unlimited"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiresAt">Expires On</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <div className="flex items-end justify-between pb-1">
                <div className="space-y-0.5">
                  <Label htmlFor="couponActive">Active</Label>
                  <p className="text-sm text-muted-foreground">Redeemable when on.</p>
                </div>
                <Switch id="couponActive" checked={isActive} onCheckedChange={setIsActive} />
              </div>
            </div>

            {selectedCourse && (
              <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 text-sm">
                <span className="text-muted-foreground">
                  {selectedCourse.title}: <strong>₹{selectedCourse.price}</strong> →{" "}
                  <strong className={discount === 100 ? "text-green-600" : "text-primary"}>
                    {discount === 100 ? "FREE (₹0)" : `₹${finalAmount}`}
                  </strong>{" "}
                  <span className="text-muted-foreground">
                    ({discount}% off, saves ₹{(Number(selectedCourse.price) || 0) - finalAmount})
                  </span>
                </span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={submitting || !courseId}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {discount === 100 ? "Create Free Coupon" : "Create Coupon"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Existing Coupons</CardTitle>
          <CardDescription>
            Toggle a coupon off to stop redemptions without deleting it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No coupons yet. Create one above.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Uses</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((coupon) => {
                  const isFree = coupon.type === "percentage" && coupon.value >= 100
                  const expired =
                    coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()
                  return (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                            {coupon.code}
                          </code>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            aria-label={`Copy code ${coupon.code}`}
                            onClick={() => copyCode(coupon)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          {copiedId === coupon.id && (
                            <span className="text-xs text-green-600">Copied</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isFree ? "default" : "secondary"}
                          className={isFree ? "bg-green-600 text-white hover:bg-green-600" : ""}
                        >
                          {isFree ? "FREE" : `${coupon.value}% off`}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] truncate text-sm">
                        {coupon.courseTitle || coupon.courseId}
                      </TableCell>
                      <TableCell>
                        {coupon.usedCount}
                        {coupon.maxUses != null ? ` / ${coupon.maxUses}` : ""}
                      </TableCell>
                      <TableCell className="text-sm">
                        {coupon.expiresAt
                          ? new Date(coupon.expiresAt).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        {!coupon.isActive ? (
                          <Badge variant="outline" className="text-muted-foreground">
                            Disabled
                          </Badge>
                        ) : expired ? (
                          <Badge variant="outline" className="text-destructive">
                            Expired
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCoupon(coupon)}
                          >
                            {coupon.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteCoupon(coupon)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
