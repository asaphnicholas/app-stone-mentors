import { apiService } from './api'

// Types
export interface ExportRelatorioMentoresParams {
  periodo_inicio?: string // YYYY-MM-DD
  periodo_fim?: string // YYYY-MM-DD
  incluir_inativos?: boolean
}

export interface ExportRelatorioPerformanceParams {
  periodo_inicio?: string // YYYY-MM-DD
  periodo_fim?: string // YYYY-MM-DD
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

class RelatoriosService {
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

  // GET /api/admin/relatorios/mentores/exportar - Exportar relatório de mentores
  async exportRelatorioMentores(params?: ExportRelatorioMentoresParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.periodo_inicio) queryParams.append('periodo_inicio', params.periodo_inicio)
      if (params?.periodo_fim) queryParams.append('periodo_fim', params.periodo_fim)
      if (params?.incluir_inativos !== undefined) {
        queryParams.append('incluir_inativos', params.incluir_inativos.toString())
      }

      const endpoint = `/admin/relatorios/mentores/exportar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
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

  // GET /api/admin/relatorios/performance/exportar - Exportar relatório de performance
  async exportRelatorioPerformance(params?: ExportRelatorioPerformanceParams): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.periodo_inicio) queryParams.append('periodo_inicio', params.periodo_inicio)
      if (params?.periodo_fim) queryParams.append('periodo_fim', params.periodo_fim)

      const endpoint = `/admin/relatorios/performance/exportar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
      
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
    a.download = filename || `relatorio_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }
}

export const relatoriosService = new RelatoriosService()
export default relatoriosService
