"use client"

import { useState, type FormEvent } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, CheckCircle, Megaphone, Loader2 } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"

export default function AnnouncementSettingsPage() {
  const { data: session, status } = useSession()
  const [message, setMessage] = useState(
    "6000+ careers transformed. Explore our latest placement stories & hiring partners.",
  )
  const [href, setHref] = useState("/placements")
  const [cta, setCta] = useState("Go to Placements")
  const [enabled, setEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (status === "loading") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const role = (session as any)?.user?.role
  if (!session || role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, href, cta, enabled }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to update announcement")
        return
      }

      setSuccess("Announcement settings updated successfully.")
    } catch {
      setError("Network error — please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminPageHeader
        title="Announcements"
        description="Manage the top announcement bar shown on the site."
      />

      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow">
              <Megaphone className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Announcement Bar</CardTitle>
              <CardDescription>Control message, link and visibility.</CardDescription>
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
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Announcement text"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="href">Link URL</Label>
              <Input
                id="href"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="/placements"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cta">CTA Text</Label>
              <Input
                id="cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                placeholder="View"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enabled</Label>
                <p className="text-sm text-muted-foreground">
                  Show/hide the announcement bar.
                </p>
              </div>
              <Switch
                id="enabled"
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
