"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export type AnnouncementBarProps = {
  message?: string
  href?: string
  cta?: string
  storageKey?: string
  dismissible?: boolean
}

export default function AnnouncementBar({
  message = "New: Explore our live placements at /placements",
  href = "/placements",
  cta = "View",
  storageKey = "almabetter-announcement-dismissed",
  dismissible = true,
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (typeof window === "undefined") return
      const dismissed = localStorage.getItem(storageKey)
      setVisible(dismissed !== "true")
    } catch {
      setVisible(true)
    }
  }, [storageKey])

  if (!visible) return null

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 px-3 py-2 text-center text-sm text-primary-foreground">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-medium">{message}</span>
        {href ? (
          <Link
            href={href}
            className="rounded-full bg-background/20 px-2 py-0.5 text-xs font-semibold hover:bg-background/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
          >
            {cta}
          </Link>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          aria-label="Dismiss announcement"
          onClick={() => {
            try {
              localStorage.setItem(storageKey, "true")
            } catch {}
            setVisible(false)
          }}
          className="absolute right-2 rounded-full p-1 hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
