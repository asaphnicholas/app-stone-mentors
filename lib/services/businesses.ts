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
export interface Business {
  id: string
  nome: string
  descricao?: string
  area_atuacao: string
  localizacao?: string
  tamanho_empresa?: string
  faturamento_mensal?: number
  numero_funcionarios?: number
  desafios_principais?: string
  objetivos_mentoria?: string
  observacoes?: string
  status: 'ativo' | 'inativo' | 'mentor_pendente' | 'desengajado'
  mentor_id?: string
  mentor_nome?: string
  mentor_email?: string
  data_vinculacao_mentor?: string
  data_criacao: string
  updated_at?: string
  nome_empreendedor?: string
  telefone?: string
}

export interface BusinessDetails {
  id: string
  nome: string
  descricao?: string
  area_atuacao: string
  localização?: string
  tamanho_empresa?: string
  nome_empreendedor: string
  telefone: string
  faturamento_mensal?: number
  numero_funcionarios?: number
  desafios_principais?: string
  objetivos_mentoria?: string
  observacoes?: string
  status: 'ativo' | 'inativo' | 'mentor_pendente' | 'desengajado'
  data_criacao: string
  data_atualizacao: string
  
  mentor_id?: string
  mentor_nome?: string
  mentor_email?: string
  data_vinculacao_mentor?: string
  
  total_mentorias: number
  mentorias_disponiveis: number
  mentorias_confirmadas: number
  mentorias_em_andamento: number
  mentorias_finalizadas: number
  
  mentorias: MentoriaDetails[]
}

export interface MentoriaDetails {
  id: string
  data_agendada: string
  tipo: 'primeira' | 'followup'
  status: 'disponivel' | 'agendada' | 'confirmada' | 'em_andamento' | 'andamento' | 'finalizada'
  duracao_minutos: number
  created_at: string
  confirmada_at?: string
  checkin_at?: string
  inicio_at?: string
  finalizada_at?: string
}

export interface CreateBusinessRequest {
  nome: string
  descricao?: string
  area_atuacao: string
  localizacao?: string
  tamanho_empresa?: string
  nome_empreendedor: string
  telefone: string
  faturamento_mensal?: number
  numero_funcionarios?: number
  desafios_principais?: string
  objetivos_mentoria?: string
  observacoes?: string
}

export interface BusinessFilters {
  status_filter?: 'ATIVO' | 'INATIVO'
  area_atuacao?: string
  com_mentor?: boolean | null
  localizacao?: string
  tamanho_empresa?: string
  skip?: number
  limit?: number
}

export interface BusinessListResponse {
  businesses: Business[]
  total: number
  skip: number
  limit: number
}

export interface AvailableMentor {
  id: string
  nome: string
  email: string
  role: string
  status: string
  telefone: string
  area_atuacao: string
  protocolo_concluido: boolean
  created_at: string
  last_login: string
}

export interface AssignMentorRequest {
  mentor_id: string
  observacoes?: string
}

class BusinessesService {
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      error.message || 'Erro interno do servidor',
      error.status || 500
    )
  }

  // Admin methods
  async createBusiness(businessData: CreateBusinessRequest): Promise<Business> {
    try {
      console.log('BusinessesService.createBusiness - Dados:', businessData)
      
      const result = await apiService.post<Business>(
        API_ENDPOINTS.ADMIN.BUSINESSES,
        businessData,
        true
      )
      console.log('BusinessesService.createBusiness - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.createBusiness - Erro:', error)
      throw this.handleError(error)
    }
  }

  async getBusinesses(filters?: BusinessFilters): Promise<BusinessListResponse> {
    try {
      console.log('BusinessesService.getBusinesses - Filtros:', filters)
      
      const queryParams = new URLSearchParams()
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString())
          }
        })
      }
      
      const url = queryParams.toString() 
        ? `${API_ENDPOINTS.ADMIN.BUSINESSES}?${queryParams.toString()}`
        : API_ENDPOINTS.ADMIN.BUSINESSES
      
      const result = await apiService.get<BusinessListResponse>(url, true)
      console.log('BusinessesService.getBusinesses - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.getBusinesses - Erro:', error)
      throw this.handleError(error)
    }
  }

  async getBusinessDetails(businessId: string): Promise<BusinessDetails> {
    try {
      console.log('BusinessesService.getBusinessDetails - ID:', businessId)
      
      const result = await apiService.get<BusinessDetails>(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}/details`,
        true
      )
      console.log('BusinessesService.getBusinessDetails - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.getBusinessDetails - Erro:', error)
      throw this.handleError(error)
    }
  }

  async getAvailableMentors(): Promise<AvailableMentor[]> {
    try {
      console.log('BusinessesService.getAvailableMentors')
      
      const result = await apiService.get<AvailableMentor[]>(
        `${API_ENDPOINTS.ADMIN.USERS}?role=mentor&limit=0`,
        true
      )
      console.log('BusinessesService.getAvailableMentors - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.getAvailableMentors - Erro:', error)
      throw this.handleError(error)
    }
  }

  async assignMentor(businessId: string, data: AssignMentorRequest): Promise<Business> {
    try {
      console.log('BusinessesService.assignMentor - Business ID:', businessId, 'Data:', data)
      
      const result = await apiService.post<Business>(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}/assign-mentor`,
        data,
        true
      )
      console.log('BusinessesService.assignMentor - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.assignMentor - Erro:', error)
      throw this.handleError(error)
    }
  }

  async updateBusiness(businessId: string, data: Business): Promise<Business> {
    try {
      console.log('BusinessesService.updateBusiness - Business ID:', businessId, 'Data:', data)
      
      const result = await apiService.put<Business>(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}`,
        data,
        true
      )
      console.log('BusinessesService.updateBusiness - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('BusinessesService.updateBusiness - Erro:', error)
      throw this.handleError(error)
    }
  }

  async deleteBusiness(businessId: string): Promise<void> {
    try {
      console.log('BusinessesService.deleteBusiness - Business ID:', businessId)
      
      await apiService.delete(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}`,
        true
      )
      console.log('BusinessesService.deleteBusiness - Negócio deletado com sucesso')
    } catch (error) {
      console.error('BusinessesService.deleteBusiness - Erro:', error)
      throw this.handleError(error)
    }
  }

  async unassignMentor(businessId: string, motivo: string): Promise<void> {
    try {
      console.log('BusinessesService.unassignMentor - Business ID:', businessId, 'Motivo:', motivo)
      
      const params = new URLSearchParams({ motivo })
      await apiService.delete(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}/unassign-mentor?${params.toString()}`,
        true
      )
      console.log('BusinessesService.unassignMentor - Mentor desvinculado com sucesso')
    } catch (error) {
      console.error('BusinessesService.unassignMentor - Erro:', error)
      throw this.handleError(error)
    }
  }
}

export const businessesService = new BusinessesService()
