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
export interface Material {
  id: string
  titulo: string
  descricao: string
  tipo: 'PDF' | 'VIDEO' | 'LINK' | 'APRESENTACAO'
  url_arquivo?: string
  nome_arquivo?: string
  tamanho_arquivo?: number
  obrigatorio: boolean
  ordem: number
  duracao_minutos?: number
  created_at: string
  updated_at: string
}

export interface MaterialProgress {
  material: Material & {
    duracao_formatada?: string
    tamanho_formatado?: string
    nome_arquivo?: string
  }
  progresso: {
    id?: string
    iniciado: boolean
    concluido: boolean
    status_formatado: string
    data_inicio?: string
    data_conclusao?: string
    feedback?: string
    avaliacao?: number
  } | null
}

export interface ProgressSummary {
  mentor_id: string
  total_materiais: number
  materiais_obrigatorios: number
  materiais_iniciados: number
  materiais_concluidos: number
  materiais_obrigatorios_concluidos: number
  pode_mentorar: boolean
  progresso_percentual: number
}

export interface StartMaterialResponse {
  id: string
  mentor_id: string
  material_id: string
  iniciado: boolean
  concluido: boolean
  data_inicio: string
  status_formatado: string
}

export interface CreateMaterialRequest {
  titulo: string
  descricao: string
  tipo: 'PDF' | 'VIDEO' | 'LINK' | 'APRESENTACAO'
  url_arquivo?: string
  nome_arquivo?: string
  tamanho_arquivo?: number
  obrigatorio: boolean
  ordem: number
  duracao_minutos?: number
}

export interface UpdateMaterialRequest {
  titulo?: string
  descricao?: string
  url_arquivo?: string
  nome_arquivo?: string
  tamanho_arquivo?: number
  obrigatorio?: boolean
  ordem?: number
  duracao_minutos?: number
  ativo?: boolean
}

export interface CompleteMaterialRequest {
  feedback?: string
  avaliacao?: number
}

export interface QualificationStatus {
  qualified: boolean
  requirements: {
    protocol_completed: boolean
    mandatory_materials_completed: boolean
    total_requirements_met: boolean
  }
  missing_requirements: string[]
  materials_summary: {
    completed: number
    total: number
  }
}

export interface UploadResponse {
  url_arquivo: string
  nome_arquivo: string
  tamanho_arquivo: number
  tipo: string
}

export interface FileInfo {
  material_id: string
  titulo: string
  tipo: string
  nome_arquivo: string
  tamanho_formatado: string
  sas_url: string
  sas_expires_in: string
  can_access: boolean
}

class MaterialsService {
  // Admin methods
  async getMaterials(): Promise<Material[]> {
    try {
      return await apiService.get<Material[]>(API_ENDPOINTS.ADMIN.MATERIALS, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async createMaterial(materialData: CreateMaterialRequest): Promise<Material> {
    try {
      console.log('MaterialsService.createMaterial - Dados recebidos:', materialData)
      console.log('MaterialsService.createMaterial - Endpoint:', API_ENDPOINTS.ADMIN.MATERIALS)
      
      const result = await apiService.post<Material>(API_ENDPOINTS.ADMIN.MATERIALS, materialData, true)
      console.log('MaterialsService.createMaterial - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MaterialsService.createMaterial - Erro:', error)
      throw this.handleError(error)
    }
  }

  async updateMaterial(materialId: string, materialData: UpdateMaterialRequest): Promise<Material> {
    try {
      console.log('MaterialsService.updateMaterial - ID:', materialId)
      console.log('MaterialsService.updateMaterial - Dados recebidos:', materialData)
      
      const result = await apiService.put<Material>(`${API_ENDPOINTS.ADMIN.MATERIALS}/${materialId}`, materialData, true)
      console.log('MaterialsService.updateMaterial - Resultado:', result)
      
      return result
    } catch (error) {
      console.error('MaterialsService.updateMaterial - Erro:', error)
      throw this.handleError(error)
    }
  }

  async deleteMaterial(materialId: string): Promise<void> {
    try {
      console.log('MaterialsService.deleteMaterial - ID:', materialId)
      
      await apiService.delete(`${API_ENDPOINTS.ADMIN.MATERIALS}/${materialId}`, true)
      console.log('MaterialsService.deleteMaterial - Material deletado com sucesso')
      
    } catch (error) {
      console.error('MaterialsService.deleteMaterial - Erro:', error)
      throw this.handleError(error)
    }
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      return await apiService.post<UploadResponse>(
        API_ENDPOINTS.ADMIN.MATERIALS_UPLOAD,
        formData,
        true // Include auth
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Mentor methods
  async getMentorMaterials(): Promise<MaterialProgress[]> {
    try {
      return await apiService.get<MaterialProgress[]>(API_ENDPOINTS.MENTOR.MATERIALS, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getProgressSummary(): Promise<ProgressSummary> {
    try {
      return await apiService.get<ProgressSummary>(`${API_ENDPOINTS.MENTOR.MATERIALS}/progress`, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async startMaterial(materialId: string): Promise<StartMaterialResponse> {
    try {
      return await apiService.post<StartMaterialResponse>(
        `${API_ENDPOINTS.MENTOR.MATERIALS}/${materialId}/start`,
        {},
        true
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async completeMaterial(materialId: string, data: CompleteMaterialRequest): Promise<void> {
    try {
      await apiService.post(
        API_ENDPOINTS.MENTOR.MATERIALS_COMPLETE(materialId),
        data,
        true
      )
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async getQualificationStatus(): Promise<QualificationStatus> {
    try {
      return await apiService.get<QualificationStatus>(API_ENDPOINTS.MENTOR.QUALIFICATION_STATUS, true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // File access methods
  async getFileInfo(materialId: string): Promise<FileInfo> {
    try {
      return await apiService.get<FileInfo>(API_ENDPOINTS.FILES.MATERIAL_INFO(materialId), true)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  async downloadFile(materialId: string): Promise<void> {
    try {
      const response = await fetch(`/api${API_ENDPOINTS.FILES.MATERIAL_DOWNLOAD(materialId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao baixar arquivo')
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'arquivo'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Create blob and download
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  getFileAccessUrl(materialId: string, expiryHours: number = 2): string {
    return `/api${API_ENDPOINTS.FILES.MATERIAL_ACCESS(materialId)}?expiry_hours=${expiryHours}`
  }

  // Utility methods
  getMaterialTypeIcon(tipo: string): string {
    switch (tipo) {
      case 'pdf':
        return '📄'
      case 'video':
        return '🎥'
      case 'link':
        return '🔗'
      case 'apresentacao':
        return '📊'
      default:
        return '📁'
    }
  }

  getMaterialTypeLabel(tipo: string): string {
    switch (tipo) {
      case 'pdf':
        return 'PDF'
      case 'video':
        return 'Vídeo'
      case 'link':
        return 'Link'
      case 'apresentacao':
        return 'Apresentação'
      default:
        return 'Arquivo'
    }
  }

  formatFileSize(bytes?: number): string {
    if (!bytes) return 'N/A'
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  formatDuration(minutes?: number): string {
    if (!minutes) return 'N/A'
    
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  getProgressStatusColor(status: string): string {
    switch (status) {
      case 'Concluído':
        return 'text-green-600 bg-green-100'
      case 'Em Progresso':
        return 'text-blue-600 bg-blue-100'
      case 'Não Iniciado':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error.status === 401) {
      throw new ApiError('Não autorizado. Faça login novamente.', 401)
    }

    if (error.status === 403) {
      throw new ApiError('Acesso negado. Você não tem permissão para esta ação.', 403)
    }

    if (error.status === 404) {
      throw new ApiError('Material não encontrado.', 404)
    }

    throw new ApiError(
      error.message || 'Erro interno do servidor. Tente novamente.',
      error.status || 500
    )
  }
}

export const materialsService = new MaterialsService()
export default materialsService
