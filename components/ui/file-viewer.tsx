"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFilePdf, 
  faVideo, 
  faImage, 
  faFilePowerpoint,
  faDownload,
  faExternalLinkAlt,
  faTimes,
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeMute,
  faExpand,
  faCompress,
  faBuilding,
  faUser,
  faPhone,
  faUsers,
  faChartLine,
  faCalendarAlt,
  faMapMarkerAlt,
  faBriefcase,
  faHandshake,
  faRocket,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
  faEdit,
  faPlay as faPlayIcon
} from "@fortawesome/free-solid-svg-icons"
import { materialsService } from "@/lib/services/materials"
import { businessesService, type BusinessDetails, type MentoriaDetails } from "@/lib/services/businesses"
import { formatDateToBR, formatDateTimeToBR } from "@/lib/utils/date"

interface FileInfo {
  material_id: string
  titulo: string
  tipo: string
  nome_arquivo: string
  tamanho_formatado: string
  sas_url: string
  sas_expires_in: string
  can_access: boolean
}

interface FileViewerProps {
  materialId?: string
  materialTitle?: string
  materialType?: string
  businessId?: string
  businessName?: string
  isOpen: boolean
  onClose: () => void
  mode?: 'file' | 'business'
}

export function FileViewer({ 
  materialId, 
  materialTitle, 
  materialType, 
  businessId,
  businessName,
  isOpen, 
  onClose,
  mode = 'file'
}: FileViewerProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoControls, setVideoControls] = useState({
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0
  })

  useEffect(() => {
    if (isOpen) {
      if (mode === 'file' && materialId) {
        loadFileInfo()
      } else if (mode === 'business' && businessId) {
        loadBusinessDetails()
      }
    }
  }, [isOpen, materialId, businessId, mode])

  const loadFileInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const info = await materialsService.getFileInfo(materialId!)
      setFileInfo(info)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar arquivo')
    } finally {
      setIsLoading(false)
    }
  }

  const loadBusinessDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const details = await businessesService.getBusinessDetails(businessId!)
      setBusinessDetails(details)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar detalhes do negócio')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      await materialsService.downloadFile(materialId!)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao baixar arquivo')
    }
  }

  const handleOpenExternal = () => {
    if (fileInfo?.sas_url) {
      window.open(fileInfo.sas_url, '_blank')
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getFileIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return faFilePdf
      case 'video':
        return faVideo
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return faImage
      case 'apresentacao':
      case 'ppt':
      case 'pptx':
        return faFilePowerpoint
      default:
        return faFilePdf
    }
  }

  const getFileTypeLabel = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'pdf':
        return 'PDF'
      case 'video':
        return 'Vídeo'
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'Imagem'
      case 'apresentacao':
      case 'ppt':
      case 'pptx':
        return 'Apresentação'
      default:
        return 'Arquivo'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'Disponível'
      case 'confirmada':
        return 'Confirmada'
      case 'em_andamento':
      case 'andamento':
        return 'Em Andamento'
      case 'finalizada':
        return 'Finalizada'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'disponivel':
        return faClock
      case 'confirmada':
        return faCheckCircle
      case 'em_andamento':
      case 'andamento':
        return faPlayIcon
      case 'finalizada':
        return faCheckCircle
      default:
        return faClock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmada':
        return 'bg-blue-100 text-blue-800'
      case 'em_andamento':
      case 'andamento':
        return 'bg-green-100 text-green-800'
      case 'finalizada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const renderFileContent = () => {
    if (!fileInfo) return null

    const tipo = fileInfo.tipo.toLowerCase()

    switch (tipo) {
      case 'pdf':
        return (
          <div className="w-full h-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
            <iframe
              src={`${fileInfo.sas_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              className="w-full h-full border-0"
              title={fileInfo.titulo}
              style={{ 
                minHeight: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)',
                height: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)'
              }}
              allow="fullscreen"
            />
          </div>
        )

      case 'video':
        return (
          <div className="relative w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <video
              src={fileInfo.sas_url}
              className="w-full h-full max-w-full max-h-full object-contain"
              controls
              style={{ 
                minHeight: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)',
                height: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)'
              }}
              onPlay={() => setVideoControls(prev => ({ ...prev, isPlaying: true }))}
              onPause={() => setVideoControls(prev => ({ ...prev, isPlaying: false }))}
              onTimeUpdate={(e) => {
                const video = e.target as HTMLVideoElement
                setVideoControls(prev => ({
                  ...prev,
                  currentTime: video.currentTime,
                  duration: video.duration
                }))
              }}
            >
              Seu navegador não suporta a reprodução de vídeos.
            </video>
          </div>
        )

      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg p-2">
            <img
              src={fileInfo.sas_url}
              alt={fileInfo.titulo}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
              style={{ 
                minHeight: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)',
                maxHeight: isFullscreen ? 'calc(95vh - 140px)' : 'calc(85vh - 140px)'
              }}
              onError={() => setError('Erro ao carregar imagem')}
            />
          </div>
        )

      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-lg p-4">
            <FontAwesomeIcon 
              icon={getFileIcon(fileInfo.tipo)} 
              className="h-16 w-16 text-gray-400 mb-4" 
            />
            <p className="text-gray-600 mb-4 text-center">Visualização não disponível para este tipo de arquivo</p>
            <Button onClick={handleOpenExternal} variant="outline">
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4 mr-2" />
              Abrir em Nova Aba
            </Button>
          </div>
        )
    }
  }

  const renderBusinessContent = () => {
    if (!businessDetails) return null

    return (
      <div className="w-full h-full overflow-y-auto p-6 space-y-6">
        {/* Informações do Negócio */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Informações do Negócio</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-semibold text-gray-900">{businessDetails.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Área de Atuação</p>
              <p className="font-semibold text-gray-900">{businessDetails.area_atuacao}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Localização</p>
              <p className="font-semibold text-gray-900">{businessDetails.localização || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tamanho da Empresa</p>
              <p className="font-semibold text-gray-900">{businessDetails.tamanho_empresa || 'Não informado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={`${businessDetails.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {businessDetails.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data de Criação</p>
              <p className="font-semibold text-gray-900">{formatDateToBR(businessDetails.data_criacao)}</p>
            </div>
          </div>
          
          {businessDetails.descricao && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Descrição</p>
              <p className="text-gray-900 leading-relaxed">{businessDetails.descricao}</p>
            </div>
          )}
        </div>

        {/* Informações do Empreendedor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Empreendedor</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-semibold text-gray-900">{businessDetails.nome_empreendedor}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-semibold text-gray-900">{businessDetails.telefone}</p>
            </div>
          </div>
        </div>

        {/* Informações Financeiras */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Informações Financeiras</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Faturamento Mensal</p>
              <p className="font-semibold text-gray-900">
                {businessDetails.faturamento_mensal 
                  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(businessDetails.faturamento_mensal)
                  : 'Não informado'
                }
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Número de Funcionários</p>
              <p className="font-semibold text-gray-900">
                {businessDetails.numero_funcionarios || 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        {/* Mentor Vinculado */}
        {businessDetails.mentor_id && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faHandshake} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Mentor Vinculado</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nome</p>
                <p className="font-semibold text-gray-900">{businessDetails.mentor_nome}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{businessDetails.mentor_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Vinculação</p>
                <p className="font-semibold text-gray-900">
                  {businessDetails.data_vinculacao_mentor ? formatDateToBR(businessDetails.data_vinculacao_mentor) : 'Não informado'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Estatísticas de Mentorias */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faRocket} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Estatísticas de Mentorias</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{businessDetails.total_mentorias}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{businessDetails.mentorias_disponiveis}</p>
              <p className="text-sm text-gray-600">Disponíveis</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{businessDetails.mentorias_confirmadas}</p>
              <p className="text-sm text-gray-600">Confirmadas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{businessDetails.mentorias_finalizadas}</p>
              <p className="text-sm text-gray-600">Finalizadas</p>
            </div>
          </div>
        </div>

        {/* Histórico de Mentorias */}
        {businessDetails.mentorias && businessDetails.mentorias.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Histórico de Mentorias</h3>
            </div>
            
            <div className="space-y-3">
              {businessDetails.mentorias.map((mentoria) => (
                <div key={mentoria.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={getStatusIcon(mentoria.status)} className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {mentoria.tipo === 'primeira' ? 'Primeira Mentoria' : 'Follow-up'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTimeToBR(mentoria.data_agendada)} • {mentoria.duracao_minutos} min
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(mentoria.status)}>
                    {getStatusText(mentoria.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desafios e Objetivos */}
        {(businessDetails.desafios_principais || businessDetails.objetivos_mentoria) && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Desafios e Objetivos</h3>
            </div>
            
            {businessDetails.desafios_principais && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Desafios Principais</p>
                <p className="text-gray-900 leading-relaxed">{businessDetails.desafios_principais}</p>
              </div>
            )}
            
            {businessDetails.objetivos_mentoria && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Objetivos da Mentoria</p>
                <p className="text-gray-900 leading-relaxed">{businessDetails.objetivos_mentoria}</p>
              </div>
            )}
          </div>
        )}

        {/* Observações */}
        {businessDetails.observacoes && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Observações</h3>
            </div>
            
            <p className="text-gray-900 leading-relaxed">{businessDetails.observacoes}</p>
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  const title = mode === 'file' ? materialTitle : businessName
  const icon = mode === 'file' ? getFileIcon(materialType || '') : faBuilding

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`
        ${isFullscreen 
          ? 'w-[98vw] h-[98vh] max-w-none max-h-none' 
          : 'max-w-[95vw] w-[95vw] max-h-[90vh] lg:max-w-7xl xl:max-w-[90vw]'
        } 
        p-0 bg-white
      `}>
        <DialogHeader className="p-4 pb-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-green-light/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={icon} 
                  className="h-4 w-4 text-stone-green-dark" 
                />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 truncate max-w-[300px] sm:max-w-[500px]">
                  {title}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {mode === 'file' ? getFileTypeLabel(materialType || '') : 'Detalhes do Negócio'}
                  </Badge>
                  {mode === 'file' && fileInfo && (
                    <>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{fileInfo.tamanho_formatado}</span>
                      <span className="text-xs text-gray-500 hidden sm:inline">•</span>
                      <span className="text-xs text-gray-500 hidden sm:inline">Expira em {fileInfo.sas_expires_in}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {mode === 'file' && (
                <>
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    disabled={!fileInfo?.can_access}
                    className="px-2 py-1 h-8 text-xs"
                    title="Baixar arquivo"
                  >
                    <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Baixar</span>
                  </Button> */}
                  {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpenExternal}
                    disabled={!fileInfo?.can_access}
                    className="px-2 py-1 h-8 text-xs"
                    title="Abrir em nova aba"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3 mr-1" />
                    <span className="hidden sm:inline">Abrir</span>
                  </Button> */}
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-3 overflow-hidden min-h-0">
          {isLoading ? (
            <div className={`w-full flex items-center justify-center ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-green-dark mx-auto mb-4"></div>
                <p className="text-gray-600">
                  {mode === 'file' ? 'Carregando arquivo...' : 'Carregando detalhes...'}
                </p>
              </div>
            </div>
          ) : error ? (
            <div className={`w-full flex items-center justify-center ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              <div className="text-center">
                <FontAwesomeIcon icon={icon} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={mode === 'file' ? loadFileInfo : loadBusinessDetails} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : mode === 'file' && fileInfo && fileInfo.can_access ? (
            <div className={`w-full ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              {renderFileContent()}
            </div>
          ) : mode === 'business' && businessDetails ? (
            <div className={`w-full ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              {renderBusinessContent()}
            </div>
          ) : (
            <div className={`w-full flex items-center justify-center ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              <div className="text-center">
                <FontAwesomeIcon icon={icon} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {mode === 'file' ? 'Acesso ao arquivo não disponível' : 'Detalhes não disponíveis'}
                </p>
                {mode === 'file' && (
                  <Button onClick={handleOpenExternal} variant="outline">
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4 mr-2" />
                    Tentar Abrir em Nova Aba
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}