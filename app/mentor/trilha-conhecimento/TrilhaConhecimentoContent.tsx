"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faFilePdf, 
  faVideo, 
  faLink, 
  faFilePowerpoint, 
  faCheckCircle,
  faPlay,
  faExternalLinkAlt,
  faStar,
  faClock,
  faLock,
  faUnlock,
  faTrophy,
  faGraduationCap,
  faEye,
  faBookOpen,
  faChartLine,
  faAward,
  faRocket
} from "@fortawesome/free-solid-svg-icons"
import { materialsService, type MaterialProgress, type QualificationStatus, type ProgressSummary } from "@/lib/services/materials"
import { useToast } from "@/components/ui/toast"
import { FileViewer } from "@/components/ui/file-viewer"

// Hook para detectar hidratação
function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

// Componente de Loading
const LoadingState = () => (
  <div className="space-y-8">
    {/* Header Loading */}
    <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faGraduationCap} className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Trilha de Conhecimento</h1>
          <p className="text-white/90 text-xl">Carregando seu progresso...</p>
          <p className="text-white/80 text-base">Aguarde um momento</p>
        </div>
      </div>
    </div>

    {/* Progress Card Loading */}
    <Card className="border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-60"></div>
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </CardContent>
    </Card>

    {/* Materials Loading */}
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  <div className="h-8 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function TrilhaConhecimentoContent() {
  const [materials, setMaterials] = useState<MaterialProgress[]>([])
  const [qualificationStatus, setQualificationStatus] = useState<QualificationStatus | null>(null)
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialProgress | null>(null)
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [avaliacao, setAvaliacao] = useState("")
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerMaterial, setViewerMaterial] = useState<MaterialProgress | null>(null)
  
  const { addToast } = useToast()
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated) {
      loadData()
    }
  }, [isHydrated])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [materialsData, qualificationData, progressData] = await Promise.all([
        materialsService.getMentorMaterials(),
        materialsService.getQualificationStatus(),
        materialsService.getProgressSummary()
      ])
      
      setMaterials(materialsData)
      setQualificationStatus(qualificationData)
      setProgressSummary(progressData)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar trilha",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteMaterial = async () => {
    if (!selectedMaterial) return

    try {
      await materialsService.completeMaterial(selectedMaterial.material.id, {
        feedback: feedback || undefined,
        avaliacao: avaliacao ? parseInt(avaliacao) : undefined,
      })

      addToast({
        type: "success",
        title: "Material concluído!",
        message: `"${selectedMaterial.material.titulo}" foi marcado como concluído.`,
      })

      setIsCompleteDialogOpen(false)
      setFeedback("")
      setAvaliacao("")
      setSelectedMaterial(null)
      loadData()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao concluir material",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const handleStartMaterial = async (material: MaterialProgress) => {
    try {
      await materialsService.startMaterial(material.material.id)
      
      addToast({
        type: "success",
        title: "Material iniciado!",
        message: `"${material.material.titulo}" foi marcado como iniciado.`,
      })
      
      loadData()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao iniciar material",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const openCompleteDialog = (material: MaterialProgress) => {
    setSelectedMaterial(material)
    setIsCompleteDialogOpen(true)
  }

  const handleViewMaterial = (material: MaterialProgress) => {
    setViewerMaterial(material)
    setViewerOpen(true)
  }

  const handleCloseViewer = () => {
    setViewerOpen(false)
    setViewerMaterial(null)
  }

  const getMaterialIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
        return faFilePdf
      case 'video':
        return faVideo
      case 'link':
        return faLink
      case 'apresentacao':
        return faFilePowerpoint
      default:
        return faFilePdf
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído':
        return faCheckCircle
      case 'Em Progresso':
        return faPlay
      default:
        return faLock
    }
  }

  const getProgressPercentage = () => {
    if (progressSummary) {
      return Math.round(progressSummary.progresso_percentual)
    }
    if (!qualificationStatus) return 0
    const { completed, total } = qualificationStatus.materials_summary
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faGraduationCap} className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Trilha de Conhecimento</h1>
              <p className="text-white/90 text-xl">Complete os materiais para se qualificar como mentor</p>
              <p className="text-white/80 text-base">Desenvolva as habilidades necessárias para mentorar empreendedores</p>
            </div>
          </div>
          
          {(progressSummary?.pode_mentorar || qualificationStatus?.qualified) && (
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg">
              <FontAwesomeIcon icon={faTrophy} className="h-6 w-6" />
              <div>
                <span className="font-bold text-lg block">Qualificado!</span>
                <span className="text-white/90 text-sm">Pronto para mentorar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faChartLine} className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Seu Progresso</h2>
                <p className="text-gray-600 text-lg">
                  {progressSummary ? 
                    `${progressSummary.materiais_concluidos} de ${progressSummary.total_materiais} materiais concluídos` :
                    `${qualificationStatus?.materials_summary.completed || 0} de ${qualificationStatus?.materials_summary.total || 0} materiais concluídos`
                  }
                </p>
                {progressSummary && (
                  <div className="text-sm text-gray-500 mt-1">
                    {progressSummary.materiais_obrigatorios_concluidos} de {progressSummary.materiais_obrigatorios} obrigatórios • {progressSummary.materiais_iniciados} iniciados
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-stone-green-dark">{getProgressPercentage()}%</div>
              <div className="text-gray-600 text-base">Concluído</div>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={getProgressPercentage()} 
              className="h-4 bg-gray-200"
              style={{
                background: `linear-gradient(to right, 
                  rgb(var(--stone-green-dark)) 0%, 
                  rgb(var(--stone-green-light)) ${getProgressPercentage()}%, 
                  #e5e7eb ${getProgressPercentage()}%, 
                  #e5e7eb 100%)`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-full opacity-20"></div>
          </div>
          
          {qualificationStatus?.missing_requirements && qualificationStatus.missing_requirements.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-3 mb-3">
                <FontAwesomeIcon icon={faAward} className="h-5 w-5 text-amber-600" />
                <p className="font-semibold text-amber-800">Requisitos para qualificação:</p>
              </div>
              <ul className="space-y-2">
                {qualificationStatus.missing_requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-3 text-amber-700">
                    <FontAwesomeIcon icon={faLock} className="h-3 w-3" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faBookOpen} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Materiais</p>
                <p className="text-2xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressSummary?.materiais_concluidos || materials.filter(m => m.progresso?.concluido).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faPlay} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Em Progresso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {progressSummary?.materiais_iniciados || materials.filter(m => m.progresso?.iniciado && !m.progresso?.concluido).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materials List */}
      <div className="space-y-6">
        {materials.map((materialProgress, index) => {
          const { material, progresso } = materialProgress
          const isCompleted = progresso?.concluido ?? false
          const isStarted = progresso?.iniciado ?? false
          const isLocked =
            !isCompleted &&
            !isStarted &&
            index > 0 &&
            !(materials[index - 1].progresso?.concluido ?? false)

          return (
            <Card 
              key={material.id} 
              className={`group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                isCompleted ? 'bg-gradient-to-r from-emerald-50 to-green-50' : 
                isLocked ? 'opacity-60' : ''
              }`}
            >
              <CardContent className="p-0">
                {/* Header com gradiente */}
                <div className={`p-6 text-white relative overflow-hidden ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                    : isLocked 
                      ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
                      : 'bg-gradient-to-br from-stone-green-light to-stone-green-dark'
                }`}>
                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-8 -translate-x-4"></div>
                  
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon 
                          icon={getMaterialIcon(material.tipo)} 
                          className="h-7 w-7 text-white" 
                        />
                      </div>
                      <div>
                        <div className="text-xs text-white/80 font-medium mb-1">Material #{index + 1}</div>
                        <div className="text-sm text-white/90">{material.tipo.toUpperCase()}</div>
                        {material.obrigatorio && (
                          <Badge className="bg-white/20 text-white text-xs border-0 mt-1">
                            Obrigatório
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={`text-xs border-0 ${
                        isCompleted 
                          ? 'bg-white/20 text-white' 
                          : isStarted 
                            ? 'bg-white/20 text-white' 
                            : 'bg-white/20 text-white'
                      }`}>
                        <FontAwesomeIcon 
                          icon={getStatusIcon(progresso?.status_formatado || 'Não Iniciado')} 
                          className="h-3 w-3 mr-1" 
                        />
                        {progresso?.status_formatado || 'Não Iniciado'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Conteúdo principal */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-stone-green-dark transition-colors">
                    {material.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {material.descricao}
                  </p>

                  {/* Material Details */}
                  <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4" />
                      <span className="font-medium">{material.tipo.toUpperCase()}</span>
                    </div>
                    {material.duracao_formatada && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                        <span>{material.duracao_formatada}</span>
                      </div>
                    )}
                    {material.tamanho_formatado && (
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faFilePdf} className="h-4 w-4" />
                        <span>{material.tamanho_formatado}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {isCompleted ? (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-emerald-600">
                          <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5" />
                          <span className="font-semibold">Concluído</span>
                          {progresso?.avaliacao && (
                            <div className="flex items-center gap-1 ml-2">
                              <FontAwesomeIcon icon={faStar} className="h-4 w-4" />
                              <span className="font-medium">{progresso?.avaliacao}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : isLocked ? (
                      <div className="flex items-center gap-3 text-gray-500">
                        <FontAwesomeIcon icon={faLock} className="h-5 w-5" />
                        <span className="font-medium">Bloqueado - Complete o material anterior</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {!isStarted && (
                          <Button
                            size="sm"
                            onClick={() => handleStartMaterial(materialProgress)}
                            className="bg-gradient-to-r from-stone-green-light to-stone-green-dark hover:from-stone-green-dark hover:to-stone-green-light text-white shadow-lg h-10 px-4"
                          >
                            <FontAwesomeIcon icon={faRocket} className="h-4 w-4 mr-2" />
                            Iniciar
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewMaterial(materialProgress)}
                          className="border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white h-10 px-4"
                        >
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (material.url_arquivo) {
                              window.open(material.url_arquivo, '_blank')
                            }
                          }}
                          className="border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white h-10 px-4"
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4 mr-2" />
                          Abrir
                        </Button>
                      </div>
                    )}

                    {isStarted && !isCompleted && (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-10 px-4"
                        onClick={() => openCompleteDialog(materialProgress)}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
                        Concluir
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Complete Material Dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Concluir Material</DialogTitle>
            <DialogDescription className="text-gray-600">
              Marque "{selectedMaterial?.material.titulo}" como concluído e deixe seu feedback
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="feedback" className="text-sm font-medium text-gray-700">Feedback (opcional)</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Compartilhe sua experiência com este material..."
                rows={4}
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="avaliacao" className="text-sm font-medium text-gray-700">Avaliação (opcional)</Label>
              <Select value={avaliacao} onValueChange={setAvaliacao}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione uma nota" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ⭐ - Muito ruim</SelectItem>
                  <SelectItem value="2">2 ⭐⭐ - Ruim</SelectItem>
                  <SelectItem value="3">3 ⭐⭐⭐ - Regular</SelectItem>
                  <SelectItem value="4">4 ⭐⭐⭐⭐ - Bom</SelectItem>
                  <SelectItem value="5">5 ⭐⭐⭐⭐⭐ - Excelente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCompleteMaterial}
              className="px-6 py-2 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
            >
              <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
              Concluir Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Viewer */}
      {viewerMaterial && (
        <FileViewer
          materialId={viewerMaterial.material.id}
          materialTitle={viewerMaterial.material.titulo}
          materialType={viewerMaterial.material.tipo}
          isOpen={viewerOpen}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  )
}