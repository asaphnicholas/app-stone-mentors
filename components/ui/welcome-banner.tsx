"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sparkles, ArrowRight } from "lucide-react"

interface WelcomeBannerProps {
  type: "new-business" | "training-pending" | "first-login"
  message: string
  actionText?: string
  onAction?: () => void
  className?: string
}

export function WelcomeBanner({ type, message, actionText, onAction, className }: WelcomeBannerProps) {
  const bannerStyles = {
    "new-business": "bg-gradient-to-r from-green-50 to-green-100 border-green-200",
    "training-pending": "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200",
    "first-login": "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200",
  }

  return (
    <Card className={cn("border-2", bannerStyles[type], className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full">
              <Sparkles className="h-5 w-5 text-stone-green-light" />
            </div>
            <div>
              <p className="font-medium text-stone-green-dark">{message}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {type === "new-business" && "Clique para ver os detalhes e entrar em contato"}
                {type === "training-pending" && "Complete o treinamento para começar a mentorar"}
                {type === "first-login" && "Bem-vindo à plataforma Stone Mentors!"}
              </p>
            </div>
          </div>
          {actionText && onAction && (
            <Button onClick={onAction} className="bg-stone-green-light hover:bg-stone-green-dark">
              {actionText}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
