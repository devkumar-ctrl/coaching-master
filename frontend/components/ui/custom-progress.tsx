"use client"

import { cn } from "@/lib/utils"
import { CheckCircle } from "lucide-react"

interface ProgressStepProps {
  steps: {
    title: string
    description?: string
    completed: boolean
    active?: boolean
  }[]
  className?: string
}

export function ProgressSteps({ steps, className }: ProgressStepProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={index} className="flex items-start space-x-4">
          {/* Step indicator */}
          <div className="flex flex-col items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
              step.completed 
                ? "bg-green-500 border-green-500 text-white" 
                : step.active 
                  ? "bg-primary border-primary text-primary-foreground animate-pulse"
                  : "bg-background border-muted-foreground text-muted-foreground"
            )}>
              {step.completed ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={cn(
                "w-0.5 h-8 mt-2 transition-colors duration-300",
                step.completed ? "bg-green-500" : "bg-muted"
              )} />
            )}
          </div>
          
          {/* Step content */}
          <div className="flex-1 pb-8">
            <h3 className={cn(
              "font-semibold transition-colors duration-300",
              step.completed 
                ? "text-green-600" 
                : step.active 
                  ? "text-primary"
                  : "text-muted-foreground"
            )}>
              {step.title}
            </h3>
            {step.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  className?: string
}

export function CircularProgress({ 
  value, 
  max = 100, 
  size = "md", 
  showValue = true,
  className 
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const circumference = 2 * Math.PI * 45 // radius of 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", sizeClasses[size], className)}>
      <svg
        className="transform -rotate-90 w-full h-full"
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-500 ease-out"
        />
      </svg>
      
      {/* Center text */}
      {showValue && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-semibold text-primary",
          textSizes[size]
        )}>
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  )
}
