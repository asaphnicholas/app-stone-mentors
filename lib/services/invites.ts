import { apiService } from './api'

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
export interface Invite {
  id: string
  email: string
  nome: string
  token: string
  created_at: string
  expires_at: string
  usado: boolean
  expirado: boolean
  admin_nome: string
}

export interface InvitesListResponse {
  invites: Invite[]
  total: number
  pendentes: number
  usados: number
  expirados: number
}

export interface CreateInviteRequest {
  email: string
  nome: string
}

export interface CreateInviteResponse {
  id: string
  email: string
  nome: string
  token: string
  created_at: string
  expires_at: string
  usado: boolean
  expirado: boolean
  admin_nome: string
}

class InvitesService {
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }

  // POST /api/v1/admin/invites/ - Criar convite
  async createInvite(data: CreateInviteRequest): Promise<CreateInviteResponse> {
    try {
      console.log('InvitesService.createInvite', data)
      
      const result = await apiService.post<CreateInviteResponse>(
        '/admin/invites',
        data,
        true
      )
      console.log('InvitesService.createInvite - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('InvitesService.createInvite - Erro:', error)
      throw this.handleError(error)
    }
  }

  // GET /api/v1/admin/invites/ - Listar convites
  async getInvites(): Promise<InvitesListResponse> {
    try {
      console.log('InvitesService.getInvites')
      
      const result = await apiService.get<InvitesListResponse>(
        '/admin/invites',
        true
      )
      console.log('InvitesService.getInvites - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('InvitesService.getInvites - Erro:', error)
      throw this.handleError(error)
    }
  }
}

export const invitesService = new InvitesService()
export default invitesService
