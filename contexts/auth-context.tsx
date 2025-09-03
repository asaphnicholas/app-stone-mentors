"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { AuthService, type AuthState } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  useEffect(() => {
    // Check for existing authentication on mount
    const user = AuthService.getCurrentUser()
    setState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { user } = await AuthService.login(email, password)
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/mentor/dashboard")
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    await AuthService.logout()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
    router.push("/")
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
