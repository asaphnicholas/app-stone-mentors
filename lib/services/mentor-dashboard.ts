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
export interface MentoriasRealizadas {
  total_mentorias: number
  concluidas: number
  tempo_medio_meses: number
}

export interface ConteudosConcluidos {
  total_materiais: number
  concluidos: number
  progresso_percentual: number
  ultimo_material: string
}

export interface StatusQualificacao {
  is_qualified: boolean
  status_text: string
  is_active: boolean
}

export interface MentoriaAtiva {
  negocio_id: string
  negocio_nome: string
  empreendedor_nome: string
  data_inicio: string
  proxima_sessao: string
  status: string
  progresso_percentual: number
  tempo_em_andamento_meses: number
}

export interface MentorDashboard {
  mentorias_realizadas: MentoriasRealizadas
  conteudos_concluidos: ConteudosConcluidos
  status_qualificacao: StatusQualificacao
  mentoria_ativa: MentoriaAtiva
}

class MentorDashboardService {
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }

  // GET /api/v1/mentor/dashboard - Dados do dashboard do mentor
  async getDashboard(): Promise<MentorDashboard> {
    try {
      console.log('MentorDashboardService.getDashboard')
      
      const result = await apiService.get<MentorDashboard>(
        '/mentor/dashboard',
        true
      )
      console.log('MentorDashboardService.getDashboard - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MentorDashboardService.getDashboard - Erro:', error)
      throw this.handleError(error)
    }
  }
}

export const mentorDashboardService = new MentorDashboardService()
export default mentorDashboardService
