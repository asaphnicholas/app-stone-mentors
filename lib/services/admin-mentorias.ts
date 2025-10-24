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
export interface MentoriaStats {
  total_mentorias: number
  mentorias_finalizadas: number
  mentorias_agendadas: number
  mentorias_em_andamento: number
  nps_medio_geral: number
  total_negocios_atendidos: number
  total_mentores_ativos: number
  media_mentorias_por_negocio: number
  taxa_conclusao: number
  periodo: {
    inicio: string
    fim: string
  }
}

export interface MentoriaNegocio {
  id: string
  nome: string
  nome_empreendedor: string
  telefone?: string
  email?: string
  area_atuacao: string
  localizacao?: string
  data_vinculacao_mentor?: string
}

export interface MentoriaMentor {
  id: string
  nome: string
  email: string
  telefone?: string
  area_formacao?: string
}

export interface MentoriaNPS {
  nota_mentoria?: number
  nota_mentor?: number
  nota_programa?: number
  nps_medio?: number
  nps_legado?: number
}

export interface Mentoria {
  id: string
  negocio: MentoriaNegocio
  mentor: MentoriaMentor
  tipo: 'primeira' | 'followup'
  status: 'DISPONIVEL' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
  data_agendada: string
  data_confirmada?: string
  data_checkin?: string
  data_finalizada?: string
  duracao_minutos: number
  tem_diagnostico: boolean
  tem_checkout: boolean
  nps?: MentoriaNPS
  created_at: string
}

export interface MentoriasListResponse {
  mentorias: Mentoria[]
  total: number
  skip: number
  limit: number
  has_more: boolean
  filtros_aplicados: {
    status?: string
    negocio_id?: string
    mentor_id?: string
    tipo?: string
    periodo: string
  }
}

export interface MentoriaDiagnostico {
  id: string
  tempo_mercado?: string
  faturamento_mensal?: string
  num_funcionarios?: string
  desafios?: string[]
  observacoes?: string
  criado_em?: string
  atualizado_em?: string
  
  // Novos campos
  nome_completo?: string
  email?: string
  telefone_whatsapp?: string
  status_negocio?: string
  tempo_funcionamento?: string
  setor_atuacao?: string
  
  // Maturidade (1-5)
  organizacao_financeira?: number
  divulgacao_marketing?: number
  estrategia_comercial?: number
  relacionamento_cliente?: number
  ferramentas_digitais?: number
  planejamento_gestao?: number
  conhecimento_legal?: number
  
  // Dor principal
  dor_principal?: string
  
  // Psicométrico
  perfil_risco?: string
  questao_logica?: string
  questao_memoria?: string
  
  // Personalidade (1-4)
  personalidade_agir_primeiro?: number
  personalidade_solucoes_problemas?: number
  personalidade_pressentimento?: number
  personalidade_prazo?: number
  personalidade_fracasso_opcao?: number
  personalidade_decisao_correta?: number
  personalidade_oportunidades_riscos?: number
  personalidade_sucesso?: number
}

export interface MentoriaCheckout {
  id: string
  nota_mentoria?: number
  nota_mentor?: number
  nota_programa?: number
  nps_medio?: number
  nps_legado?: number
  feedback?: string
  observacoes?: string
  proximos_passos?: string
  criado_em?: string
}

export interface MentoriaDetalhes extends Mentoria {
  timestamps?: {
    created_at: string
    data_agendada: string
    confirmada_at?: string
    checkin_at?: string
    inicio_at?: string
    finalizada_at?: string
  }
  diagnostico?: MentoriaDiagnostico
  checkout?: MentoriaCheckout
}

export interface ListMentoriasParams {
  status?: string
  negocio_id?: string
  mentor_id?: string
  tipo?: string
  data_inicio?: string
  data_fim?: string
  skip?: number
  limit?: number
  search?: string
}

export interface GetStatsParams {
  data_inicio?: string
  data_fim?: string
}

export interface ExportParams {
  periodo_inicio?: string
  periodo_fim?: string
  status?: string
  tipo?: string
}

class AdminMentoriasService {
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }

  /**
   * GET /api/admin/mentorias/stats
   * Retorna estatísticas consolidadas de mentorias
   */
  async getMentoriaStats(params?: GetStatsParams): Promise<MentoriaStats> {
    try {
      console.log('AdminMentoriasService.getMentoriaStats - Params:', params)
      
      const queryParams = new URLSearchParams()
      if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
      if (params?.data_fim) queryParams.append('data_fim', params.data_fim)
      
      const queryString = queryParams.toString()
      const endpoint = queryString 
        ? `/admin/mentorias/stats?${queryString}` 
        : '/admin/mentorias/stats'
      
      const result = await apiService.get<MentoriaStats>(endpoint, true)
      console.log('AdminMentoriasService.getMentoriaStats - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('AdminMentoriasService.getMentoriaStats - Erro:', error)
      throw this.handleError(error)
    }
  }

  /**
   * GET /api/admin/mentorias
   * Lista todas as mentorias com filtros e paginação
   */
  async listMentorias(params?: ListMentoriasParams): Promise<MentoriasListResponse> {
    try {
      console.log('AdminMentoriasService.listMentorias - Params:', params)
      
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append('status', params.status)
      if (params?.negocio_id) queryParams.append('negocio_id', params.negocio_id)
      if (params?.mentor_id) queryParams.append('mentor_id', params.mentor_id)
      if (params?.tipo) queryParams.append('tipo', params.tipo)
      if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
      if (params?.data_fim) queryParams.append('data_fim', params.data_fim)
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
      if (params?.search) queryParams.append('search', params.search)
      
      const queryString = queryParams.toString()
      const endpoint = queryString 
        ? `/admin/mentorias?${queryString}` 
        : '/admin/mentorias'
      
      const result = await apiService.get<MentoriasListResponse>(endpoint, true)
      console.log('AdminMentoriasService.listMentorias - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('AdminMentoriasService.listMentorias - Erro:', error)
      throw this.handleError(error)
    }
  }

  /**
   * GET /api/admin/mentorias/{id}
   * Retorna detalhes completos de uma mentoria específica
   */
  async getMentoriaDetails(mentoriaId: string): Promise<MentoriaDetalhes> {
    try {
      console.log('AdminMentoriasService.getMentoriaDetails - ID:', mentoriaId)
      
      const result = await apiService.get<MentoriaDetalhes>(
        `/admin/mentorias/${mentoriaId}`,
        true
      )
      console.log('AdminMentoriasService.getMentoriaDetails - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('AdminMentoriasService.getMentoriaDetails - Erro:', error)
      throw this.handleError(error)
    }
  }

  /**
   * GET /api/admin/relatorios/mentorias/exportar
   * Exporta relatório de mentorias em CSV
   */
  async exportMentoriasCSV(params?: ExportParams): Promise<Blob> {
    try {
      console.log('AdminMentoriasService.exportMentoriasCSV - Params:', params)
      
      const queryParams = new URLSearchParams()
      if (params?.periodo_inicio) queryParams.append('periodo_inicio', params.periodo_inicio)
      if (params?.periodo_fim) queryParams.append('periodo_fim', params.periodo_fim)
      if (params?.status) queryParams.append('status', params.status)
      if (params?.tipo) queryParams.append('tipo', params.tipo)
      
      const queryString = queryParams.toString()
      const endpoint = queryString 
        ? `/admin/relatorios/mentorias/exportar?${queryString}` 
        : '/admin/relatorios/mentorias/exportar'
      
      const token = localStorage.getItem('access_token')
      if (!token) {
        throw new ApiError('Token de autenticação não encontrado', 401)
      }
      
      // Usar o proxy do Next.js (API_BASE_URL)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
      const url = `${apiBaseUrl}${endpoint}`
      
      console.log('AdminMentoriasService.exportMentoriasCSV - URL:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new ApiError(
          errorData?.message || 'Erro ao exportar relatório',
          response.status,
          errorData
        )
      }
      
      const blob = await response.blob()
      console.log('AdminMentoriasService.exportMentoriasCSV - Blob criado:', blob.size, 'bytes')
      
      return blob
    } catch (error) {
      console.error('AdminMentoriasService.exportMentoriasCSV - Erro:', error)
      throw this.handleError(error)
    }
  }

  /**
   * Helper: Download do arquivo CSV
   */
  downloadCSV(blob: Blob, filename: string = 'mentorias.csv') {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  }

  /**
   * Helper: Formatar data para exibição
   */
  formatDate(dateString?: string): string {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Helper: Calcular NPS médio
   */
  calculateNPSMedio(nps?: MentoriaNPS): number | null {
    if (!nps) return null
    
    const notas = [
      nps.nota_mentoria,
      nps.nota_mentor,
      nps.nota_programa
    ].filter(n => n !== undefined && n !== null) as number[]
    
    if (notas.length === 0) return nps.nps_legado || null
    
    const soma = notas.reduce((acc, nota) => acc + nota, 0)
    return soma / notas.length
  }
}

export const adminMentoriasService = new AdminMentoriasService()
export default adminMentoriasService

