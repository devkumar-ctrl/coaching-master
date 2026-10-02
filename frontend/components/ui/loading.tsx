import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className={cn("animate-spin rounded-full border-2 border-primary border-t-transparent", sizeClasses[size], className)} />
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
    </div>
  )
}

interface PulseLoadingProps {
  className?: string
}

export function PulseLoading({ className }: PulseLoadingProps) {
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
      <div className="w-3 h-3 bg-primary/70 rounded-full animate-pulse delay-75"></div>
      <div className="w-3 h-3 bg-primary/50 rounded-full animate-pulse delay-150"></div>
    </div>
  )
}
