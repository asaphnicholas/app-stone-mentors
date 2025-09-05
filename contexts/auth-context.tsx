"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authService, type User } from "@/lib/services/auth"
import { useRouter } from "next/navigation"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: {
    nome: string
    email: string
    senha: string
    telefone: string
    competencias: string
    area_atuacao: string
  }) => Promise<void>
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
    const user = authService.getCurrentUser()
    setState({
      user,
      isLoading: false,
      isAuthenticated: authService.isAuthenticated(),
    })
  }, [])

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { user } = await authService.login({ email, senha: password })
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      // Redirect based on user role
      const redirectPath = authService.getRedirectPath()
      router.push(redirectPath)
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const register = async (userData: {
    nome: string
    email: string
    senha: string
    telefone: string
    competencias: string
    area_atuacao: string
  }) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const { user } = await authService.register(userData)
      console.log('Register success, user:', user)
      
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })

      console.log('State updated, redirecting to dashboard')
      // Small delay to ensure state is updated before redirect
      setTimeout(() => {
        router.push("/mentor/dashboard")
      }, 100)
    } catch (error) {
      console.log('Register error:', error)
      setState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    await authService.logout()
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
    router.push("/")
  }

  return <AuthContext.Provider value={{ ...state, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
