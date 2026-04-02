import { apiService } from './api'
import { API_ENDPOINTS, STORAGE_KEYS } from '@/lib/config/env'
import { getAreaFormacaoLabel as getEscolaridadeLabel } from '@/lib/constants/areas-formacao'

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
export interface Mentor {
  id: string
  nome: string
  email: string
  telefone: string
  area_atuacao: string
  area_formacao: string
  competencias: string
  /** URL da foto (se o backend retornar) */
  foto_url?: string | null
  url_foto?: string | null
  foto_perfil_url?: string | null
  protocolo_concluido: boolean
  mentorias_ativas: number
  /**
   * Métrica conforme contrato da API de listagem: pode ser sessões ou conexões — o rótulo na UI deve refletir o que o backend documentar.
   * Preferir labels explícitos (“sessões” vs “conexões”) em cada tela.
   */
  total_mentorias: number
  negocios_vinculados: number
  nps_medio: number
  created_at: string
  last_login?: string
}

export interface Negocio {
  id: string
  nome: string
  empreendedor_nome: string
  area_atuacao: string
  data_vinculacao: string
  status: string
}

export interface DiagnosticoData {
  tempo_mercado: string
  faturamento_mensal: string
  numero_funcionarios: string
  desafios_principais: string
  observacoes: string
}

export interface CheckoutData {
  nps: number
  observacoes: string
  proximos_passos: string
  created_at: string
}

export interface Mentoria {
  id: string
  data_agendada: string
  tipo: 'primeira' | 'followup'
  status: 'DISPONIVEL' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA'
  duracao_minutos: number
  created_at: string
  confirmada_at?: string
  checkin_at?: string
  inicio_at?: string
  finalizada_at?: string
  negocio: {
    id: string
    nome: string
    empreendedor_nome: string
    area_atuacao: string
  }
  diagnostico?: DiagnosticoData
  checkout?: CheckoutData
}

export interface MentorHistorico {
  mentor: Mentor
  estatisticas: {
    /** Total de sessões/registros de mentoria (encontros). */
    total_mentorias: number
    /** Conexões/ciclos finalizados (empreendimentos), não soma de sessões no cliente. */
    mentorias_finalizadas: number
    mentorias_ativas: number
    nps_medio: number
    negocios_vinculados: number
  }
  negocios: Negocio[]
  mentorias: Mentoria[]
}

export interface MentorPerformance {
  mentor: {
    id: string
    nome: string
    email: string
    area_atuacao: string
    area_formacao: string
  }
  estatisticas_gerais: {
    /**
     * Métrica de desempenho no mesmo “eixo” que `negocios_unicos_mentorados` (conexões/empreendimentos);
     * na UI não somar os dois — escolha um indicador ou mostre um só com rótulo claro.
     */
    total_mentorias_realizadas: number
    mentorias_agendadas: number
    taxa_conclusao: number
    negocios_unicos_mentorados: number
    tempo_medio_mentoria_minutos: number
  }
  nps: {
    nps_medio_geral: number
    nps_medio_ultimos_3_meses: number
    nps_medio_anterior: number
    total_avaliacoes: number
    distribuicao: {
      promotores: number
      neutros: number
      detratores: number
    }
    tendencia: 'melhorando' | 'piorando' | 'estavel'
  }
  mentorias_por_tipo: {
    primeira_mentoria: number
    followup: number
    percentual_primeira: number
    percentual_followup: number
  }
  periodo_analise: {
    data_inicio: string
    data_fim: string
    dias_analisados: number
  }
}

export interface RelatorioMentorias {
  filtros_aplicados: {
    mentor_id?: string
    periodo_inicio?: string
    periodo_fim?: string
    data_inicio: string
    data_fim: string
  }
  estatisticas_gerais: {
    total_mentorias: number
    mentorias_finalizadas: number
    mentorias_ativas: number
    taxa_conclusao: number
    nps_medio: number
  }
  distribuicao_por_tipo: {
    primeira_mentoria: number
    followup: number
    percentual_primeira: number
    percentual_followup: number
  }
  distribuicao_por_status: {
    FINALIZADA: number
    CONFIRMADA: number
    EM_ANDAMENTO: number
    DISPONIVEL: number
    CANCELADA: number
  }
  relatorio_por_mentor: Record<string, {
    mentor_nome: string
    mentor_email: string
    total_mentorias: number
    mentorias_finalizadas: number
    nps_medio: number
  }>
  mentorias_detalhadas: Array<{
    id: string
    mentor_id: string
    mentor_nome: string
    negocio_id: string
    negocio_nome: string
    data_agendada: string
    tipo: string
    status: string
    duracao_minutos: number
    created_at: string
    finalizada_at?: string
    nps?: number
    tempo_realizacao_minutos: number
  }>
}

class MentorsService {
  private handleError(error: any): never {
    if (error.status && error.message) {
      throw error as ApiError
    }
    throw {
      message: 'Erro interno do servidor',
      status: 500
    } as ApiError
  }

  /** URL para pré-visualização da foto (pública, via proxy Next). */
  getMentorFotoPublicUrl(mentorId: string): string {
    const base = typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_BASE_URL || '/api')
      : '/api'
    return `${base}${API_ENDPOINTS.MENTORS.FOTO_PUBLIC(mentorId)}`
  }

  /**
   * Download da foto pelo endpoint admin autenticado.
   */
  async downloadMentorFotoAdmin(mentorId: string): Promise<{ blob: Blob; filename: string }> {
    const token =
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) : null
    if (!token) {
      throw { message: 'Sessão expirada. Faça login novamente.', status: 401 }
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'
    const url = `${base}${API_ENDPOINTS.ADMIN.MENTOR_FOTO(mentorId)}`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const errJson = await res.json().catch(() => null)
      throw { message: errJson?.message || 'Não foi possível baixar a foto', status: res.status }
    }
    const blob = await res.blob()
    const cd = res.headers.get('Content-Disposition')
    let filename = `foto_mentor_${mentorId}.jpg`
    if (cd) {
      const m = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(cd)
      if (m?.[1]) filename = m[1].replace(/['"]/g, '')
    }
    return { blob, filename }
  }

  // Listar mentores com/sem mentorias ativas
  async getMentorsWithMentorias(comMentorias: boolean = true): Promise<Mentor[]> {
    try {
      const params = new URLSearchParams({ com_mentorias: comMentorias.toString() })
      const endpoint = `${API_ENDPOINTS.ADMIN.MENTORS_WITH_MENTORIAS}?${params}`
      return await apiService.get<Mentor[]>(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Histórico de mentorias de um mentor
  async getMentorHistorico(mentorId: string): Promise<MentorHistorico> {
    try {
      return await apiService.get<MentorHistorico>(API_ENDPOINTS.ADMIN.MENTOR_HISTORICO(mentorId), true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Performance de um mentor
  async getMentorPerformance(mentorId: string): Promise<MentorPerformance> {
    try {
      return await apiService.get<MentorPerformance>(API_ENDPOINTS.ADMIN.MENTOR_PERFORMANCE(mentorId), true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Relatório de mentorias
  async getRelatorioMentorias(params?: {
    mentor_id?: string
    periodo_inicio?: string
    periodo_fim?: string
  }): Promise<RelatorioMentorias> {
    try {
      const queryParams = new URLSearchParams()
      if (params?.mentor_id) queryParams.append('mentor_id', params.mentor_id)
      if (params?.periodo_inicio) queryParams.append('periodo_inicio', params.periodo_inicio)
      if (params?.periodo_fim) queryParams.append('periodo_fim', params.periodo_fim)
      
      const endpoint = `${API_ENDPOINTS.ADMIN.MENTORS_RELATORIO}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await apiService.get<RelatorioMentorias>(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Helper functions
  getStatusBadgeVariant(status: string) {
    switch (status) {
      case 'FINALIZADA':
        return 'default'
      case 'CONFIRMADA':
        return 'secondary'
      case 'EM_ANDAMENTO':
        return 'outline'
      case 'DISPONIVEL':
        return 'outline'
      case 'CANCELADA':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'FINALIZADA':
        return 'Finalizada'
      case 'CONFIRMADA':
        return 'Confirmada'
      case 'EM_ANDAMENTO':
        return 'Em Andamento'
      case 'DISPONIVEL':
        return 'Disponível'
      case 'CANCELADA':
        return 'Cancelada'
      default:
        return status
    }
  }

  getTipoLabel(tipo: string) {
    switch (tipo) {
      case 'PRIMEIRA':
        return 'Primeira Mentoria'
      case 'FOLLOWUP':
        return 'Follow-up'
      default:
        return tipo
    }
  }

  getNpsColor(nps: number) {
    if (nps >= 9) return 'text-green-600'
    if (nps >= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  getNpsLabel(nps: number) {
    if (nps >= 9) return 'Promotor'
    if (nps >= 7) return 'Neutro'
    return 'Detrator'
  }

  getTendenciaIcon(tendencia: string) {
    switch (tendencia) {
      case 'melhorando':
        return '📈'
      case 'piorando':
        return '📉'
      case 'estavel':
        return '➡️'
      default:
        return '➡️'
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

  formatDateShort(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  getAreaAtuacaoLabel(area: string) {
    const areas: Record<string, string> = {
      'TECNOLOGIA_ENGENHARIA': 'Tecnologia e Engenharia',
      'CANAL_FRANQUIAS': 'Canal e Franquias',
      'COMERCIAL_POLOS': 'Comercial e Polos',
      'RISCOS': 'Riscos',
      'FINANCEIRO': 'Financeiro',
      'GENTE_GESTAO': 'Gente e Gestão',
      'RELACIONAMENTO_CLIENTE': 'Relacionamento com Cliente',
      'TESOURARIA': 'Tesouraria',
      'MARKETING_ESTRATEGIA': 'Marketing e Estratégia',
      'COMERCIO_VAREJO': 'Comércio e Varejo',
      'SERVICOS_CONSULTORIA': 'Serviços e Consultoria',
      'INDUSTRIA_MANUFACURA': 'Indústria e Manufatura',
      'SAUDE_BEMESTAR': 'Saúde e Bem-estar',
      'EDUCACAO_TREINAMENTO': 'Educação e Treinamento',
      'FINANCAS_CONTABILIDADE': 'Finanças e Contabilidade',
      'MARKETING_PUBLICIDADE': 'Marketing e Publicidade',
      'TURISMO_HOSPITALIDADE': 'Turismo e Hospitalidade',
      'AGRICULTURA_AGRONEGOCIO': 'Agricultura e Agronegócio',
      'OUTROS': 'Outros'
    }
    return areas[area] || area
  }

  getAreaFormacaoLabel(area: string) {
    return getEscolaridadeLabel(area)
  }

  // Método para desativar mentor
  async deactivateMentor(mentorId: string, motivo?: string): Promise<any> {
    try {
      const endpoint = `/admin/mentors/${mentorId}/desativar`
      const body = motivo ? { motivo } : {}
      return await apiService.post(endpoint, body, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Método para ativar mentor
  async activateMentor(mentorId: string, motivo?: string): Promise<any> {
    try {
      const endpoint = `/admin/mentors/${mentorId}/ativar`
      const body = motivo ? { motivo } : {}
      return await apiService.post(endpoint, body, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Método para deletar mentor
  async deleteMentor(mentorId: string, motivo: string, forcar?: boolean): Promise<any> {
    try {
      const params = new URLSearchParams()
      params.append('motivo', motivo)
      if (forcar) {
        params.append('forcar', 'true')
      }
      
      const endpoint = `/admin/mentors/${mentorId}?${params.toString()}`
      return await apiService.delete(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }
}

export const mentorsService = new MentorsService()
