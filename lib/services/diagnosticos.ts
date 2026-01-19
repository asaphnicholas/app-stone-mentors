import { apiService } from './api'

// Types
export interface Diagnostico {
  diagnostico_id: string
  mentoria_id: string
  created_at: string
  mentoria: {
    id: string
    data_agendada: string
    tipo: string
    status: string
    duracao_minutos: number
  }
  mentor: {
    id: string
    nome: string
    email: string
  }
  negocio: {
    id: string
    nome: string
    empreendedor_nome: string
    telefone: string
    area_atuacao: string
  }
  // Dados do empreendedor
  nome_completo: string
  email: string
  telefone_whatsapp: string
  status_negocio: string
  tempo_funcionamento: string
  setor_atuacao: string
  // Avaliações (1-4)
  controle_financeiro: number
  divulgação_marketing: number
  atrair_clientes_vender: number
  atender_clientes: number
  ferramentas_gestao: number
  organizacao_negocio: number
  obrigacoes_legais_juridicas: number
  // Desafios
  dor_principal: string
  falta_caixa_financiamento?: string
  dificuldade_funcionarios?: string
  clientes_reclamando?: string
  relacionamento_fornecedores?: string
  // Perfil
  perfil_investimento: string
  motivo_desistencia: string
  // Comportamento empreendedor (1-4)
  agir_primeiro_consequencias_depois: number
  pensar_varias_solucoes: number
  seguir_primeiro_pressentimento: number
  fazer_coisas_antes_prazo: number
  fracasso_nao_opcao: number
  decisao_negocio_correta: number
  focar_oportunidades_riscos: number
  acreditar_sucesso: number
}

export interface ListDiagnosticosParams {
  mentoria_id?: string
  mentor_id?: string
  negocio_id?: string
  data_inicio?: string
  data_fim?: string
  skip?: number
  limit?: number
}

export interface ListDiagnosticosResponse {
  diagnosticos: Diagnostico[]
  total: number
  skip: number
  limit: number
  has_more: boolean
  filtros_aplicados: {
    mentoria_id: string | null
    mentor_id: string | null
    negocio_id: string | null
    periodo: string
  }
}

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

class DiagnosticosService {
  private handleError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error
    }
    
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.detail || 'Erro ao processar requisição'
      return new ApiError(message, error.response.status, error.response.data)
    }
    
    return new ApiError(error.message || 'Erro interno do servidor')
  }

  // GET /api/admin/diagnosticos - Lista todos os diagnósticos
  async listDiagnosticos(params?: ListDiagnosticosParams): Promise<ListDiagnosticosResponse> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.mentoria_id) queryParams.append('mentoria_id', params.mentoria_id)
      if (params?.mentor_id) queryParams.append('mentor_id', params.mentor_id)
      if (params?.negocio_id) queryParams.append('negocio_id', params.negocio_id)
      if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
      if (params?.data_fim) queryParams.append('data_fim', params.data_fim)
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())

      const endpoint = `/admin/diagnosticos${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      return await apiService.get<ListDiagnosticosResponse>(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // GET /api/admin/diagnosticos/mentoria/{mentoria_id} - Obter diagnóstico por mentoria
  async getDiagnosticoByMentoria(mentoriaId: string): Promise<Diagnostico> {
    try {
      const endpoint = `/admin/diagnosticos/mentoria/${mentoriaId}`
      return await apiService.get<Diagnostico>(endpoint, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // GET /api/admin/diagnosticos/exportar - Exportar diagnósticos em CSV
  async exportDiagnosticos(params?: ListDiagnosticosParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.mentoria_id) queryParams.append('mentoria_id', params.mentoria_id)
      if (params?.mentor_id) queryParams.append('mentor_id', params.mentor_id)
      if (params?.negocio_id) queryParams.append('negocio_id', params.negocio_id)
      if (params?.data_inicio) queryParams.append('data_inicio', params.data_inicio)
      if (params?.data_fim) queryParams.append('data_fim', params.data_fim)

      const endpoint = `/admin/diagnosticos/exportar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
      const token = localStorage.getItem('access_token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || '/api'}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro ao exportar' }))
        throw new ApiError(error.message, response.status)
      }

      return await response.blob()
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Helper para download do CSV
  downloadCSV(blob: Blob, filename?: string) {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `diagnosticos_export_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export const diagnosticosService = new DiagnosticosService()
export default diagnosticosService
