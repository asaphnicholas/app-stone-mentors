import { apiService } from './api'
import { API_ENDPOINTS } from '@/lib/config/env'

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
  status: 'ativo' | 'inativo' | 'pendente'
  telefone: string
  competencias: string
  area_atuacao: string
  protocolo_concluido: boolean
  created_at: string
  last_login?: string
  total_materiais_concluidos?: number
  pode_mentorar?: boolean
}

export interface PendingUsersResponse {
  total_pendentes: number
  usuarios: User[]
}

export interface ApproveUserRequest {
  status: 'ativo' | 'inativo'
  observacoes?: string
}

export interface ApproveUserResponse {
  success: boolean
  message: string
  user: {
    id: string
    nome: string
    status: string
    role: string
  }
}

export interface DashboardOverview {
  materials: {
    total_materials: number
    materials_obrigatorios: number
  }
  users: {
    total_usuarios: number
    mentores_pendentes: number
    mentores_ativos: number
    mentores_qualificados: number
  }
  alerts: {
    pending_approvals: number
    needs_attention: boolean
  }
}

class UsersService {
  private handleError(error: any): never {
    if (error.status && error.message) {
      throw error as ApiError
    }
    throw {
      message: 'Erro interno do servidor',
      status: 500
    } as ApiError
  }

  // Get pending users
  async getPendingUsers(): Promise<PendingUsersResponse> {
    try {
      return await apiService.get<PendingUsersResponse>(API_ENDPOINTS.ADMIN.USERS_PENDING, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get all users with filters
  async getUsers(params?: {
    role?: string
    status?: string
    search?: string
  }): Promise<User[]> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.role) queryParams.append('role', params.role)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.search) queryParams.append('search', params.search)
      
      const endpoint = `${API_ENDPOINTS.ADMIN.USERS}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await apiService.get<User[]>(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get user details
  async getUserDetails(userId: string): Promise<User> {
    try {
      return await apiService.get<User>(API_ENDPOINTS.ADMIN.USER_DETAIL(userId), true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Approve or reject user
  async approveUser(userId: string, data: ApproveUserRequest): Promise<ApproveUserResponse> {
    try {
      return await apiService.post<ApproveUserResponse>(
        API_ENDPOINTS.ADMIN.USER_APPROVE(userId),
        data,
        true
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get dashboard overview
  async getDashboardOverview(): Promise<DashboardOverview> {
    try {
      return await apiService.get<DashboardOverview>(API_ENDPOINTS.ADMIN.DASHBOARD_OVERVIEW, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Helper functions
  getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'ativo':
        return 'default'
      case 'pendente':
        return 'secondary'
      case 'inativo':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'ativo':
        return 'Ativo'
      case 'pendente':
        return 'Pendente'
      case 'inativo':
        return 'Inativo'
      default:
        return status
    }
  }

  formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

export const usersService = new UsersService()
