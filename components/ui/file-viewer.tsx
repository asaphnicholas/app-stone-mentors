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
  faCompress
} from "@fortawesome/free-solid-svg-icons"
import { materialsService } from "@/lib/services/materials"

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
  materialId: string
  materialTitle: string
  materialType: string
  isOpen: boolean
  onClose: () => void
}

export function FileViewer({ materialId, materialTitle, materialType, isOpen, onClose }: FileViewerProps) {
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null)
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
    if (isOpen && materialId) {
      loadFileInfo()
    }
  }, [isOpen, materialId])

  const loadFileInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const info = await materialsService.getFileInfo(materialId)
      setFileInfo(info)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar arquivo')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    try {
      await materialsService.downloadFile(materialId)
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

  if (!isOpen) return null

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
                  icon={getFileIcon(materialType)} 
                  className="h-4 w-4 text-stone-green-dark" 
                />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 truncate max-w-[300px] sm:max-w-[500px]">
                  {materialTitle}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getFileTypeLabel(materialType)}
                  </Badge>
                  {fileInfo && (
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
              {/* <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="hidden sm:flex px-2 py-1 h-8"
                title={isFullscreen ? "Sair do modo tela cheia" : "Modo tela cheia"}
              >
                <FontAwesomeIcon 
                  icon={isFullscreen ? faCompress : faExpand} 
                  className="h-3 w-3" 
                />
              </Button> */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={!fileInfo?.can_access}
                className="px-2 py-1 h-8 text-xs"
                title="Baixar arquivo"
              >
                <FontAwesomeIcon icon={faDownload} className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Baixar</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenExternal}
                disabled={!fileInfo?.can_access}
                className="px-2 py-1 h-8 text-xs"
                title="Abrir em nova aba"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Abrir</span>
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="px-2 py-1 h-8"
                title="Fechar"
              >
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
              </Button> */}
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
                <p className="text-gray-600">Carregando arquivo...</p>
              </div>
            </div>
          ) : error ? (
            <div className={`w-full flex items-center justify-center ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              <div className="text-center">
                <FontAwesomeIcon icon={getFileIcon(materialType)} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadFileInfo} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : fileInfo && fileInfo.can_access ? (
            <div className={`w-full ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              {renderFileContent()}
            </div>
          ) : (
            <div className={`w-full flex items-center justify-center ${
              isFullscreen ? 'h-[calc(98vh-120px)]' : 'h-[calc(85vh-120px)]'
            }`}>
              <div className="text-center">
                <FontAwesomeIcon icon={getFileIcon(materialType)} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Acesso ao arquivo não disponível</p>
                <Button onClick={handleOpenExternal} variant="outline">
                  <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4 mr-2" />
                  Tentar Abrir em Nova Aba
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}