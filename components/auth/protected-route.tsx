"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "admin" | "mentor"
  fallbackPath?: string
}

export function ProtectedRoute({ children, requiredRole, fallbackPath = "/" }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackPath)
        return
      }

      if (requiredRole && user?.role !== requiredRole) {
        // Redirect to appropriate dashboard based on user role
        const redirectPath = user?.role === "admin" ? "/admin/dashboard" : "/mentor/dashboard"
        router.push(redirectPath)
        return
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router, fallbackPath])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-stone-green-light border-t-transparent rounded-full animate-spin" />
          <span className="text-muted-foreground">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null
  }

  return <>{children}</>
}
