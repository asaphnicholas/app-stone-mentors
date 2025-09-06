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
  status: 'ATIVO' | 'INATIVO'
  mentor_id?: string
  mentor_nome?: string
  mentor_email?: string
  data_vinculacao?: string
  created_at: string
  updated_at: string
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

  async getBusinessDetails(businessId: string): Promise<Business> {
    try {
      console.log('BusinessesService.getBusinessDetails - ID:', businessId)
      
      const result = await apiService.get<Business>(
        `${API_ENDPOINTS.ADMIN.BUSINESSES}/${businessId}`,
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
        `${API_ENDPOINTS.ADMIN.USERS}?role=mentor&status=ativo`,
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
}

export const businessesService = new BusinessesService()
