import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
    period: string
  }
  color?: "verde-claro" | "verde-escuro" | "gray" | "red" | "yellow" | "blue"
  size?: "small" | "medium" | "large"
  className?: string
}

const colorClasses = {
  "verde-claro": "border-stone-green-light bg-stone-green-light/5",
  "verde-escuro": "border-stone-green-dark bg-stone-green-dark/5",
  gray: "border-muted bg-muted/20",
  red: "border-destructive bg-destructive/5",
  yellow: "border-yellow-500 bg-yellow-500/5",
  blue: "border-blue-500 bg-blue-500/5",
}

const sizeClasses = {
  small: "p-4",
  medium: "p-6",
  large: "p-8",
}

export function MetricCard({ title, value, icon, trend, color = "gray", size = "medium", className }: MetricCardProps) {
  const trendColor =
    trend?.direction === "up"
      ? "text-green-600"
      : trend?.direction === "down"
        ? "text-red-600"
        : "text-muted-foreground"

  return (
    <Card className={cn("transition-all duration-200 hover:shadow-md", colorClasses[color], className)}>
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0", sizeClasses[size])}>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent className={cn("pt-0", sizeClasses[size])}>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1", trendColor)}>
            {trend.value} {trend.period}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
