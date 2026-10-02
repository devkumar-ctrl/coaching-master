"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({ 
  end, 
  duration = 2000, 
  suffix = "", 
  prefix = "",
  className 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      
      setCount(Math.floor(end * easeOutCubic))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration])

  return (
    <span className={cn("font-bold", className)}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

interface StatsCardProps {
  title: string
  value: number
  suffix?: string
  prefix?: string
  description?: string
  icon?: React.ReactNode
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
}

export function StatsCard({
  title,
  value,
  suffix = "",
  prefix = "",
  description,
  icon,
  trend,
  trendValue,
  className
}: StatsCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600", 
    neutral: "text-muted-foreground"
  }

  return (
    <div className={cn(
      "bg-background border rounded-lg p-6 hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline space-x-2">
        <AnimatedCounter
          end={value}
          suffix={suffix}
          prefix={prefix}
          className="text-2xl font-bold text-foreground"
        />
        
        {trend && trendValue && (
          <span className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trendValue}
          </span>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  )
}
