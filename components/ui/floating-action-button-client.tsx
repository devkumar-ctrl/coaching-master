"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, MessageCircle, Calendar, User, Search, X, LayoutDashboardIcon, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Session } from "next-auth"

interface FloatingActionButtonClientProps {
  className?: string
  session?: Session | null
  latestCourseId?: string
}

export function FloatingActionButtonClient({ className, session, latestCourseId }: FloatingActionButtonClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  // Anchored to the bottom-right corner using CSS right/bottom offsets
  const [position, setPosition] = useState({ right: 24, bottom: 24 })
  const [dragStart, setDragStart] = useState({ dx: 0, dy: 0 })
  const fabRef = useRef<HTMLDivElement>(null)

  const FAB_SIZE = 56 // 14 * 4 (h-14 w-14)

  // Handle drag functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      // Bottom-right corner of the button follows the pointer
      const cornerX = Math.max(0, Math.min(e.clientX - dragStart.dx, window.innerWidth - FAB_SIZE))
      const cornerY = Math.max(FAB_SIZE, Math.min(e.clientY - dragStart.dy, window.innerHeight))

      setPosition({
        right: window.innerWidth - cornerX,
        bottom: window.innerHeight - cornerY,
      })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const touch = e.touches[0]
      const cornerX = Math.max(0, Math.min(touch.clientX - dragStart.dx, window.innerWidth - FAB_SIZE))
      const cornerY = Math.max(FAB_SIZE, Math.min(touch.clientY - dragStart.dy, window.innerHeight))

      setPosition({
        right: window.innerWidth - cornerX,
        bottom: window.innerHeight - cornerY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    const handleTouchEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleTouchEnd)
      document.body.style.userSelect = 'none' // Prevent text selection while dragging
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.body.style.userSelect = ''
    }
  }, [isDragging, dragStart])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect()
      setDragStart({
        dx: e.clientX - rect.right,
        dy: e.clientY - rect.bottom
      })
      setIsDragging(true)
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (fabRef.current) {
      const rect = fabRef.current.getBoundingClientRect()
      const touch = e.touches[0]
      setDragStart({
        dx: touch.clientX - rect.right,
        dy: touch.clientY - rect.bottom
      })
      setIsDragging(true)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    // Only toggle if we're not dragging (to distinguish between drag and click)
    if (!isDragging) {
      setIsOpen(!isOpen)
    }
  }

  // Position styles
  const positionStyles = {
    position: 'fixed' as const,
    right: `${position.right}px`,
    bottom: `${position.bottom}px`,
    left: 'auto',
    top: 'auto'
  }
  
  const getUserDashboardUrl = () => {
    if (!session?.user?.role) return "/dashboard"
    
    switch (session.user.role) {
      case "COACH":
        return `/dashboard/teacher/${session.user.id}`
      case "STUDENT": 
        return `/dashboard/student/${session.user.id}`
      case "ADMIN":
        return "/admin"
      default:
        return "/dashboard"
    }
  }

  const actions = [
    {
      icon: Search,
      label: "Find Courses",
      href: "/courses",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    ...(latestCourseId ? [{
      icon: BookOpen,
      label: "Enroll Now",
      href: `/courses/${latestCourseId}`,
      color: "bg-purple-500 hover:bg-purple-600"
    }] : []),
    {
      icon: LayoutDashboardIcon,
      label: "Dashboard",
      href: getUserDashboardUrl(),
      color: "bg-green-500 hover:bg-green-600"
    },
   
  ]

  return (
    <div 
      ref={fabRef}
      className={cn("z-50", className)}
      style={positionStyles}
    >
      {/* Action Menu */}
      <div className={cn(
        "absolute bottom-16 right-0 space-y-3 transition-all duration-300",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {actions.map((action, index) => (
          <div
            key={action.label}
            className="flex items-center space-x-3"
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <span className="bg-background border rounded-lg px-3 py-2 text-sm font-medium shadow-lg whitespace-nowrap">
              {action.label}
            </span>
            <Button
              asChild
              size="lg"
              className={cn(
                "h-12 w-12 rounded-full shadow-lg text-white transition-all duration-300 hover:scale-110",
                action.color
              )}
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all duration-300",
          isOpen && "rotate-45",
          isDragging ? "cursor-grabbing scale-105" : "cursor-grab hover:scale-110"
        )}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Plus className="h-6 w-6" />
        )}
      </Button>
    </div>
  )
}
