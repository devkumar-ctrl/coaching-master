"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Bell, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  autoClose?: boolean
  duration?: number
  onClose?: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const styleMap = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800", 
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
  info: "border-blue-200 bg-blue-50 text-blue-800"
}

export function Notification({
  id,
  type,
  title,
  message,
  action,
  autoClose = true,
  duration = 5000,
  onClose
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = iconMap[type]

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(id), 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, id, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(id), 300)
  }

  return (
    <div className={cn(
      "border rounded-lg p-4 shadow-sm transition-all duration-300 transform",
      styleMap[type],
      isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
    )}>
      <div className="flex items-start space-x-3">
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{title}</h4>
          <p className="text-sm mt-1 opacity-90">{message}</p>
          
          {action && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 h-8"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

interface LiveActivityFeedProps {
  className?: string
}

export function LiveActivityFeed({ className }: LiveActivityFeedProps) {
  const [activities, setActivities] = useState([
    { id: 1, text: "Sarah J. just booked a Math session", time: "2 min ago", type: "booking" },
    { id: 2, text: "New coach Marcus T. joined the platform", time: "5 min ago", type: "coach" },
    { id: 3, text: "Alex completed a Career Coaching session", time: "8 min ago", type: "completion" },
    { id: 4, text: "Jennifer left a 5⭐ review", time: "12 min ago", type: "review" }
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activities
      const newActivity = {
        id: Date.now(),
        text: "Student just booked a session",
        time: "now",
        type: "booking"
      }
      
      setActivities(prev => [newActivity, ...prev.slice(0, 3)])
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("bg-background border rounded-lg p-4", className)}>
      <div className="flex items-center space-x-2 mb-3">
        <Bell className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">Live Activity</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      </div>
      
      <div className="space-y-2">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{activity.text}</span>
            <Badge variant="outline" className="text-xs">
              {activity.time}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
