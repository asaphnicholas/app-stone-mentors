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
export interface MentorBusiness {
  negocio_id: string
  negocio_nome: string
  empreendedor_nome: string
  telefone: string
  area_atuacao: string
  localizacao: string
  data_vinculacao: string
  total_mentorias: number
  mentorias_confirmadas: number
  mentorias_finalizadas: number
  proxima_mentoria?: {
    id: string
    data_agendada: string
    tipo: 'primeira' | 'followup'
    status: 'disponivel' | 'confirmada' | 'em_andamento' | 'finalizada'
  }
}

export interface Mentoria {
  mentoria_id: string
  negocio: {
    id: string
    nome: string
    empreendedor_nome: string
    telefone: string
    area_atuacao: string
    localizacao: string
  }
  data_agendada: string
  tipo: 'primeira' | 'followup'
  status: 'disponivel' | 'confirmada' | 'em_andamento' | 'finalizada'
  duracao_minutos: number
  confirmada_at?: string
  checkin_at?: string
  finalizada_at?: string
  diagnostico?: {
    id: string
    tempo_mercado?: string
    faturamento_mensal?: string
    num_funcionarios?: string
    desafios?: string[]
    observacoes?: string
  }
  checkout?: {
    id: string
    observacoes?: string
    proximos_passos?: string
    created_at: string
  }
}

export interface ScheduleMentoriaRequest {
  negocio_id: string
  data_agendada: string
  duracao_minutos: number
}

export interface ScheduleMentoriaResponse {
  mentoria_id: string
  negocio_nome: string
  empreendedor_nome: string
  data_agendada: string
  tipo: 'primeira' | 'followup'
  status: 'disponivel'
  duracao_minutos: number
  message: string
}

export interface ConfirmMentoriaResponse {
  mentoria_id: string
  negocio_nome: string
  data_agendada: string
  status: 'confirmada'
  confirmada_at: string
  message: string
}

export interface CheckinMentoriaResponse {
  mentoria_id: string
  negocio_nome: string
  empreendedor_nome: string
  data_agendada: string
  tipo: 'primeira' | 'followup'
  status: 'em_andamento'
  checkin_at: string
  message: string
}

export interface DiagnosticoRequest {
  tempo_mercado?: string
  faturamento_mensal?: string
  num_funcionarios?: string
  desafios?: string[]
  observacoes?: string
}

export interface DiagnosticoResponse {
  diagnostico_id: string
  mentoria_id: string
  message: string
}

export interface CheckoutRequest {
  observacoes?: string
  proximos_passos?: string
}

export interface CheckoutResponse {
  mentoria_id: string
  negocio_nome: string
  status: 'finalizada'
  finalizada_at: string
  checkout_id: string
  message: string
}

class MentoriasService {
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }

  // GET /api/v1/mentor/businesses - Lista negócios vinculados
  async getMentorBusinesses(): Promise<MentorBusiness[]> {
    try {
      console.log('MentoriasService.getMentorBusinesses')
      
      const result = await apiService.get<MentorBusiness[]>(
        '/mentor/mentorias/businesses',
        true
      )
      console.log('MentoriasService.getMentorBusinesses - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.getMentorBusinesses - Erro:', error)
      throw this.handleError(error)
    }
  }

  // POST /api/v1/mentor/mentorias/schedule - Agenda nova mentoria
  async scheduleMentoria(data: ScheduleMentoriaRequest): Promise<ScheduleMentoriaResponse> {
    try {
      console.log('MentoriasService.scheduleMentoria - Data:', data)
      
      const result = await apiService.post<ScheduleMentoriaResponse>(
        '/mentor/mentorias/schedule',
        data,
        true
      )
      console.log('MentoriasService.scheduleMentoria - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.scheduleMentoria - Erro:', error)
      throw this.handleError(error)
    }
  }

  // POST /api/v1/mentor/mentorias/{id}/confirm - Confirma mentoria
  async confirmMentoria(mentoriaId: string): Promise<ConfirmMentoriaResponse> {
    try {
      console.log('MentoriasService.confirmMentoria - ID:', mentoriaId)
      
      const result = await apiService.post<ConfirmMentoriaResponse>(
        `/mentor/mentorias/${mentoriaId}/confirm`,
        {},
        true
      )
      console.log('MentoriasService.confirmMentoria - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.confirmMentoria - Erro:', error)
      throw this.handleError(error)
    }
  }

  // POST /api/v1/mentor/mentorias/{id}/checkin - Check-in da mentoria
  async checkinMentoria(mentoriaId: string): Promise<CheckinMentoriaResponse> {
    try {
      console.log('MentoriasService.checkinMentoria - ID:', mentoriaId)
      
      const result = await apiService.post<CheckinMentoriaResponse>(
        `/mentor/mentorias/${mentoriaId}/checkin`,
        {},
        true
      )
      console.log('MentoriasService.checkinMentoria - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.checkinMentoria - Erro:', error)
      throw this.handleError(error)
    }
  }

  // PUT /api/v1/mentor/mentorias/{id}/diagnostico - Atualiza diagnóstico
  async updateDiagnostico(mentoriaId: string, data: DiagnosticoRequest): Promise<DiagnosticoResponse> {
    try {
      console.log('MentoriasService.updateDiagnostico - ID:', mentoriaId, 'Data:', data)
      
      const result = await apiService.put<DiagnosticoResponse>(
        `/mentor/mentorias/${mentoriaId}/diagnostico`,
        data,
        true
      )
      console.log('MentoriasService.updateDiagnostico - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.updateDiagnostico - Erro:', error)
      throw this.handleError(error)
    }
  }

  // POST /api/v1/mentor/mentorias/{id}/checkout - Checkout da mentoria
  async checkoutMentoria(mentoriaId: string, data: CheckoutRequest): Promise<CheckoutResponse> {
    try {
      console.log('MentoriasService.checkoutMentoria - ID:', mentoriaId, 'Data:', data)
      
      const result = await apiService.post<CheckoutResponse>(
        `/mentor/mentorias/${mentoriaId}/checkout`,
        data,
        true
      )
      console.log('MentoriasService.checkoutMentoria - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.checkoutMentoria - Erro:', error)
      throw this.handleError(error)
    }
  }

  // GET /api/v1/mentor/mentorias/{id} - Detalhes da mentoria
  async getMentoriaDetails(mentoriaId: string): Promise<Mentoria> {
    try {
      console.log('MentoriasService.getMentoriaDetails - ID:', mentoriaId)
      
      const result = await apiService.get<Mentoria>(
        `/mentor/mentorias/${mentoriaId}`,
        true
      )
      console.log('MentoriasService.getMentoriaDetails - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.getMentoriaDetails - Erro:', error)
      throw this.handleError(error)
    }
  }

  // POST /api/v1/mentor/mentorias/schedule-next - Agenda próxima mentoria
  async scheduleNextMentoria(data: ScheduleMentoriaRequest): Promise<ScheduleMentoriaResponse> {
    try {
      console.log('MentoriasService.scheduleNextMentoria - Data:', data)
      
      const result = await apiService.post<ScheduleMentoriaResponse>(
        '/mentor/mentorias/schedule-next',
        data,
        true
      )
      console.log('MentoriasService.scheduleNextMentoria - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentoriasService.scheduleNextMentoria - Erro:', error)
      throw this.handleError(error)
    }
  }
}

export const mentoriasService = new MentoriasService()
export default mentoriasService
