export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "mentor"
  avatar?: string
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@stonementors.com",
    name: "Administrador",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "2",
    email: "mentor@stonementors.com",
    name: "João Silva",
    role: "mentor",
    createdAt: new Date(),
  },
]

export class AuthService {
  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock authentication logic
    const user = mockUsers.find((u) => u.email === email)

    if (!user || password !== "123456") {
      throw new Error("Credenciais inválidas")
    }

    const token = `mock-token-${user.id}-${Date.now()}`

    // Store in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("stone-auth-token", token)
      localStorage.setItem("stone-user", JSON.stringify(user))
    }

    return { user, token }
  }

  static async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("stone-auth-token")
      localStorage.removeItem("stone-user")
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem("stone-user")
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("stone-auth-token")
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser()
  }
}
