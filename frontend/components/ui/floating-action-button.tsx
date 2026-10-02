"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, User, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { FloatingActionButtonClient } from "./floating-action-button-client"

// Client wrapper that fetches the session and latest course from the backend
export function FloatingActionButton({ className }: { className?: string }) {
  const { data: session } = useSession()
  const [latestCourseId, setLatestCourseId] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetch('/api/courses?limit=1', { cache: 'no-store' })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.courses;
        if (list && list.length > 0) {
          setLatestCourseId(list[0]._id || list[0].id)
        }
      })
      .catch((error) => {
        console.log('Failed to fetch latest course:', error)
      })
  }, [])

  return <FloatingActionButtonClient className={className} session={session} latestCourseId={latestCourseId} />
}

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button variant="outline" size="sm" asChild>
        <Link href="/coaches">
          <Search className="h-4 w-4 mr-2" />
          Find Coach
        </Link>
      </Button>
      
      <Button variant="outline" size="sm" asChild>
        <Link href="/book-session">
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Link>
      </Button>
      
      <Button size="sm" asChild>
        <Link href="/become-coach">
          <User className="h-4 w-4 mr-2" />
          Become Coach
        </Link>
      </Button>
    </div>
  )
}
