import { apiService } from './api'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/config/env'
import { isValidAreaAtuacao } from '@/lib/constants/areas-atuacao'

// Error class
class ApiError extends Error {
  status?: number
  details?: any

  constructor(message: string, status?: number, details?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

// Types
export interface User {
  id: string
  nome: string
  email: string
  role: 'admin' | 'mentor'
  status: 'ativo' | 'inativo'
  telefone: string
  competencias: string
  area_atuacao: string
  protocolo_concluido: boolean
  created_at: string
  last_login: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface RegisterRequest {
  nome: string
  email: string
  senha: string
  telefone: string
  competencias: string
  area_atuacao: string
}

export interface RegisterResponse {
  user: User
  tokens: AuthTokens
}

class AuthService {
  private readonly TOKEN_KEY = STORAGE_KEYS.ACCESS_TOKEN
  private readonly REFRESH_TOKEN_KEY = STORAGE_KEYS.REFRESH_TOKEN
  private readonly USER_KEY = STORAGE_KEYS.USER_DATA

  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials,
        false // Don't include auth token for login
      )

      // Store tokens and user data
      this.storeTokens(response.tokens)
      this.storeUser(response.user)

      return response
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  // Register
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    try {
      // Validate area_atuacao
      if (!isValidAreaAtuacao(userData.area_atuacao)) {
        throw new ApiError('Área de atuação inválida', 400)
      }

      // Prepare registration data with role as mentor
      const registrationData = {
        ...userData,
        role: 'mentor' as const
      }

      const response = await apiService.post<RegisterResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        registrationData,
        false // Don't include auth token for registration
      )

      // Store tokens and user data
      this.storeTokens(response.tokens)
      this.storeUser(response.user)

      return response
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  // Get current user data from server
  async getCurrentUserData(): Promise<User> {
    try {
      const response = await apiService.get<User>(API_ENDPOINTS.AUTH.PROFILE)
      
      // Update stored user data
      this.storeUser(response)
      
      return response
    } catch (error) {
      throw this.handleAuthError(error)
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Call logout endpoint (for JWT stateless, just confirmation)
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT, {})
    } catch (error) {
      // Even if logout fails, we still clear local storage
      console.warn('Logout endpoint failed, but clearing local storage:', error)
    } finally {
      // Always clear local storage regardless of server response
      this.clearStorage()
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  // Get access token
  getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Get refresh token
  getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const user = this.getCurrentUser()
    return !!(token && user)
  }

  // Get user role
  getUserRole(): 'admin' | 'mentor' | null {
    const user = this.getCurrentUser()
    return user?.role || null
  }

  // Check if user is admin
  isAdmin(): boolean {
    return this.getUserRole() === 'admin'
  }

  // Check if user is mentor
  isMentor(): boolean {
    return this.getUserRole() === 'mentor'
  }

  // Get redirect path based on role
  getRedirectPath(): string {
    const role = this.getUserRole()
    
    switch (role) {
      case 'admin':
        return '/admin/dashboard'
      case 'mentor':
        return '/mentor/dashboard'
      default:
        return '/'
    }
  }

  // Private methods
  private storeTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.TOKEN_KEY, tokens.access_token)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh_token)
  }

  private storeUser(user: User): void {
    if (typeof window === 'undefined') return
    
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  private handleAuthError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error.status === 401) {
      this.clearStorage()
      throw new ApiError('Credenciais inválidas. Verifique seu email e senha.', 401)
    }

    if (error.status === 422) {
      throw new ApiError('Dados inválidos. Verifique as informações fornecidas.', 422, error.details)
    }

    if (error.status === 409) {
      throw new ApiError('Este email já está cadastrado.', 409)
    }

    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }
}

export const authService = new AuthService()
export default authService
