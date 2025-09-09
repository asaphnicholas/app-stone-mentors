"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faBuilding, 
  faUser, 
  faPhone, 
  faMapMarkerAlt, 
  faClock, 
  faCalendarAlt,
  faCheckCircle,
  faExclamationTriangle,
  faStar,
  faChartLine,
  faArrowLeft,
  faGraduationCap,
  faHandshake,
  faPlay,
  faEdit,
  faSpinner,
  faHistory,
  faUsers,
  faCalendarCheck,
  faAward,
  faClipboardList,
  faComments
} from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { mentoriasService, type BusinessHistoryResponse, type MentoriaHistory } from "@/lib/services/mentorias"
import { useToast } from "@/components/ui/toast"
import { formatDateToBR, formatDateTimeToBR } from "@/lib/utils/date"
import DiagnosticoSection from "./DiagnosticoSection"

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
          <FontAwesomeIcon icon={faHistory} className="h-10 w-10 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">Histórico de Mentorias</h1>
          <p className="text-white/90 text-xl">Carregando dados...</p>
          <p className="text-white/80 text-base">Aguarde um momento</p>
        </div>
      </div>
    </div>

    {/* Content Loading */}
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function BusinessHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const businessId = params.business_id as string
  
  const [historyData, setHistoryData] = useState<BusinessHistoryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const { addToast } = useToast()
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated && businessId) {
      loadBusinessHistory()
    }
  }, [isHydrated, businessId])

  const loadBusinessHistory = async () => {
    try {
      setIsLoading(true)
      const data = await mentoriasService.getBusinessHistory(businessId)
      setHistoryData(data)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar histórico",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
      router.push("/mentor/mentorias")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContact = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível'
      case 'confirmada': return 'Confirmada'
      case 'em_andamento': return 'Em Andamento'
      case 'andamento': return 'Em Andamento'
      case 'finalizada': return 'Finalizada'
      default: return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-blue-500 text-white'
      case 'confirmada': return 'bg-green-500 text-white'
      case 'em_andamento': return 'bg-orange-500 text-white'
      case 'andamento': return 'bg-orange-500 text-white'
      case 'finalizada': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getTipoText = (tipo: string) => {
    return tipo === 'primeira' ? 'Primeira Mentoria' : 'Mentoria de Acompanhamento'
  }

  const getNPSColor = (nps: number) => {
    if (nps >= 9) return 'text-green-600'
    if (nps >= 7) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getNPSLabel = (nps: number) => {
    if (nps >= 9) return 'Promotor'
    if (nps >= 7) return 'Neutro'
    return 'Detrator'
  }

  if (!isHydrated || isLoading) {
    return (
      <div className="space-y-8">
        <LoadingState />
      </div>
    )
  }

  if (!historyData) {
    return (
      <div className="space-y-8">
        <div className="text-center py-20">
          <div className="w-20 h-20  rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Histórico não encontrado</h3>
          <p className="text-gray-600 text-lg mb-6">Não foi possível carregar o histórico de mentorias.</p>
          <Button
            onClick={() => router.push("/mentor/mentorias")}
            className="bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
            Voltar às Mentorias
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHistory} className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Histórico de Mentorias</h1>
              <p className="text-white/90 text-lg">Acompanhamento completo do negócio "{historyData.negocio_nome}"</p>
              <p className="text-white/80 text-sm">Visualize todo o progresso e evolução das mentorias</p>
            </div>
          </div>
          
          <Button
            onClick={() => router.push("/mentor/mentorias")}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5 mr-3" />
            Voltar
          </Button>
        </div>
      </div>

      {/* Informações do Negócio */}
      <Card className="border-0 bg-gradient-to-br ">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{historyData.negocio_nome}</h2>
              <Badge className="bg-blue-500 text-white font-semibold px-3 py-1 mt-1 text-sm">
                {historyData.area_atuacao}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Empreendedor</p>
                <p className="font-bold text-gray-900 text-sm">{historyData.empreendedor_nome}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Contato</p>
                <p className="font-bold text-gray-900 text-sm">{historyData.telefone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Localização</p>
                <p className="font-bold text-gray-900 text-sm">{historyData.localizacao}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-lg flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCalendarCheck} className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Vinculado em</p>
                <p className="font-bold text-gray-900 text-sm">{formatDateToBR(historyData.data_vinculacao)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Total de Mentorias</p>
                <p className="text-2xl font-bold text-gray-900">{historyData.total_mentorias}</p>
                <p className="text-xs text-blue-600 font-medium">Sessões realizadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">Mentorias Finalizadas</p>
                <p className="text-2xl font-bold text-gray-900">{historyData.mentorias_finalizadas}</p>
                <p className="text-xs text-green-600 font-medium">Com sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faStar} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-600">NPS Médio</p>
                <p className="text-2xl font-bold text-gray-900">{historyData.nps_medio.toFixed(1)}</p>
                <p className={`text-xs font-medium ${getNPSColor(historyData.nps_medio)}`}>
                  {getNPSLabel(historyData.nps_medio)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Mentorias */}
      <Card className="border-0 ">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-lg flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHistory} className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900">
                Histórico Completo de Mentorias
              </CardTitle>
              <CardDescription className="text-sm">
                Lista de todas as mentorias realizadas com este negócio ({historyData.mentorias.length} sessões)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {historyData.mentorias.map((mentoria, index) => (
            <Card key={mentoria.id} className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-gray-50 overflow-hidden">
              <div className="relative">
                {/* Timeline indicator */}
                {/* {index < historyData.mentorias.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-stone-green-light to-stone-green-dark z-10"></div>
                )} */}
                
                <CardContent className="p-6">
                  {/* Header da Mentoria */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg z-20">
                          <FontAwesomeIcon icon={faGraduationCap} className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{getTipoText(mentoria.tipo)}</h3>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                            <span className="font-medium text-sm">{formatDateTimeToBR(mentoria.data_agendada)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                            <span className="font-medium text-sm">{mentoria.duracao_minutos} minutos</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(mentoria.status)} font-semibold px-3 py-1 text-xs`}>
                      {getStatusText(mentoria.status)}
                    </Badge>
                  </div>

                  {/* Diagnóstico */}
                  <DiagnosticoSection diagnostico={mentoria.diagnostico} />

                  {/* Checkout */}
                  {mentoria.checkout && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
                      <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-base">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={faAward} className="h-3 w-3 text-white" />
                        </div>
                        Avaliação Final
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                        {mentoria.checkout.nota_mentoria && (
                          <div className="p-3 bg-white/60 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mentoria</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-2xl font-bold ${getNPSColor(mentoria.checkout.nota_mentoria)}`}>
                                {mentoria.checkout.nota_mentoria}
                              </span>
                              <Badge className={`${getNPSColor(mentoria.checkout.nota_mentoria).replace('text-', 'bg-').replace('-600', '-100')} ${getNPSColor(mentoria.checkout.nota_mentoria)} border-0 text-xs`}>
                                {getNPSLabel(mentoria.checkout.nota_mentoria)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        {mentoria.checkout.nota_mentor && (
                          <div className="p-3 bg-white/60 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-blue-500" />
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Mentor</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-2xl font-bold ${getNPSColor(mentoria.checkout.nota_mentor)}`}>
                                {mentoria.checkout.nota_mentor}
                              </span>
                              <Badge className={`${getNPSColor(mentoria.checkout.nota_mentor).replace('text-', 'bg-').replace('-600', '-100')} ${getNPSColor(mentoria.checkout.nota_mentor)} border-0 text-xs`}>
                                {getNPSLabel(mentoria.checkout.nota_mentor)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        {mentoria.checkout.nota_programa && (
                          <div className="p-3 bg-white/60 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-green-500" />
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Programa</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-2xl font-bold ${getNPSColor(mentoria.checkout.nota_programa)}`}>
                                {mentoria.checkout.nota_programa}
                              </span>
                              <Badge className={`${getNPSColor(mentoria.checkout.nota_programa).replace('text-', 'bg-').replace('-600', '-100')} ${getNPSColor(mentoria.checkout.nota_programa)} border-0 text-xs`}>
                                {getNPSLabel(mentoria.checkout.nota_programa)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        {/* NPS Score (compatibilidade) */}
                        {mentoria.checkout.nps && !mentoria.checkout.nota_mentoria && (
                          <div className="p-3 bg-white/60 rounded-lg text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-yellow-500" />
                              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">NPS Score</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-2xl font-bold ${getNPSColor(mentoria.checkout.nps)}`}>
                                {mentoria.checkout.nps}
                              </span>
                              <Badge className={`${getNPSColor(mentoria.checkout.nps).replace('text-', 'bg-').replace('-600', '-100')} ${getNPSColor(mentoria.checkout.nps)} border-0 text-xs`}>
                                {getNPSLabel(mentoria.checkout.nps)}
                              </Badge>
                            </div>
                          </div>
                        )}
                        {mentoria.checkout.proximos_passos && (
                          <div className="p-3 bg-white/60 rounded-lg">
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Próximos Passos</span>
                            <p className="font-bold text-gray-900 text-sm">
                              {mentoria.checkout.proximos_passos === 'nova_mentoria' ? 'Nova Mentoria Agendada' : 'Processo Finalizado'}
                            </p>
                          </div>
                        )}
                      </div>
                      {(mentoria.checkout.feedback || mentoria.checkout.observacoes) && (
                        <div className="p-3 bg-white/60 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={faComments} className="h-3 w-3 text-green-600" />
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Observações</span>
                          </div>
                          <p className="text-gray-900 leading-relaxed text-sm">{mentoria.checkout.observacoes || mentoria.checkout.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                      <span>Criada: {formatDateTimeToBR(mentoria.created_at)}</span>
                    </div>
                    {mentoria.confirmada_at && (
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-green-500" />
                        <span>Confirmada: {formatDateTimeToBR(mentoria.confirmada_at)}</span>
                      </div>
                    )}
                    {mentoria.finalizada_at && (
                      <div className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-blue-500" />
                        <span>Finalizada: {formatDateTimeToBR(mentoria.finalizada_at)}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Ações */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-stone-green-light/10 to-stone-green-dark/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Button
              onClick={() => handleContact(historyData.telefone)}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg h-12 px-6 text-base font-semibold"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 mr-2" />
              Contatar via WhatsApp
            </Button>
            <Button
              onClick={() => router.push("/mentor/mentorias")}
              variant="outline"
              className="border-2 border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white h-12 px-6 text-base font-semibold"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
              Voltar às Mentorias
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}