"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  faPhoneVolume,
  faCalendarPlus,
  faChartLine,
  faGraduationCap,
  faHandshake,
  faArrowRight,
  faPlay,
  faCheck,
  faEdit,
  faSpinner,
  faHistory
} from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { mentoriasService, type MentorBusiness, type Mentoria } from "@/lib/services/mentorias"
import { useToast } from "@/components/ui/toast"
import { formatDateToBR, formatDateTimeToBR } from "@/lib/utils/date"

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
          <FontAwesomeIcon icon={faHandshake} className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Minhas Mentorias</h1>
          <p className="text-white/90 text-xl">Carregando seus negócios...</p>
          <p className="text-white/80 text-base">Aguarde um momento</p>
        </div>
      </div>
    </div>

    {/* Stats Loading */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Content Loading */}
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function MentoriasPage() {
  const [businesses, setBusinesses] = useState<MentorBusiness[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("ativas")
  
  // Modal states
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false)
  const [isDiagnosticDialogOpen, setIsDiagnosticDialogOpen] = useState(false)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<MentorBusiness | null>(null)
  const [selectedMentoria, setSelectedMentoria] = useState<Mentoria | null>(null)
  
  // Form states
  const [scheduleForm, setScheduleForm] = useState({
    data_agendada: "",
    duracao_minutos: 60
  })
  const [diagnosticForm, setDiagnosticForm] = useState({
    tempo_mercado: "",
    faturamento_mensal: "",
    num_funcionarios: "",
    desafios: [] as string[],
    observacoes: ""
  })
  const [checkoutForm, setCheckoutForm] = useState({
    observacoes: "",
    proximos_passos: ""
  })

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
      const businessesData = await mentoriasService.getMentorBusinesses()
      setBusinesses(businessesData)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar mentorias",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleScheduleSession = (business: MentorBusiness) => {
    setSelectedBusiness(business)
    
    // Se já tem mentoria agendada, preencher o formulário com os dados existentes
    if (business.proxima_mentoria) {
      setScheduleForm({
        data_agendada: business.proxima_mentoria.data_agendada,
        duracao_minutos: business.proxima_mentoria.duracao_minutos
      })
    } else {
      // Limpar formulário para novo agendamento
      setScheduleForm({
        data_agendada: "",
        duracao_minutos: 60
      })
    }
    
    setIsScheduleDialogOpen(true)
  }

  const handleScheduleMentoria = async () => {
    if (!selectedBusiness) return

    try {
      // Se já tem mentoria agendada, usar API de reagendamento
      if (selectedBusiness.proxima_mentoria) {
        await mentoriasService.rescheduleMentoria(selectedBusiness.proxima_mentoria.id, {
          data_agendada: scheduleForm.data_agendada,
          duracao_minutos: scheduleForm.duracao_minutos
        })

        addToast({
          type: "success",
          title: "Mentoria reagendada!",
          message: `Mentoria reagendada para "${selectedBusiness.negocio_nome}" com sucesso.`,
        })
      } else {
        // Novo agendamento
        await mentoriasService.scheduleMentoria({
          negocio_id: selectedBusiness.negocio_id,
          data_agendada: scheduleForm.data_agendada,
          duracao_minutos: scheduleForm.duracao_minutos
        })

        addToast({
          type: "success",
          title: "Mentoria agendada!",
          message: `Mentoria agendada para "${selectedBusiness.negocio_nome}" com sucesso.`,
        })
      }

      setIsScheduleDialogOpen(false)
      setScheduleForm({ data_agendada: "", duracao_minutos: 60 })
      setSelectedBusiness(null)
      loadData()
    } catch (error) {
      addToast({
        type: "error",
        title: selectedBusiness.proxima_mentoria ? "Erro ao reagendar mentoria" : "Erro ao agendar mentoria",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const handleContact = (phone: string) => {
    // Remove caracteres especiais do telefone para o WhatsApp
    const cleanPhone = phone.replace(/\D/g, '')
    // Adiciona código do Brasil se não tiver
    const whatsappPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    // Abre WhatsApp Web
    window.open(`https://wa.me/${whatsappPhone}`, '_blank')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-200 text-green-700 border-green-200'
      case 'em_andamento': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'disponivel': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'finalizada': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmada': return faCheckCircle
      case 'em_andamento': return faPlay
      case 'andamento': return faPlay
      case 'disponivel': return faCalendarAlt
      case 'finalizada': return faCheckCircle
      default: return faClock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada': return 'Confirmada'
      case 'em_andamento': return 'Em andamento'
      case 'andamento': return 'Em andamento'
      case 'disponivel': return 'Disponível'
      case 'finalizada': return 'Finalizada'
      default: return 'Pendente'
    }
  }

  const getTipoText = (tipo: string) => {
    switch (tipo) {
      case 'primeira': return 'Primeira Mentoria'
      case 'followup': return 'Follow-up'
      default: return tipo
    }
  }

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
  }

  // Separar negócios com e sem próxima mentoria
  const businessesWithNextMentoria = businesses.filter(b => b.proxima_mentoria)
  const businessesWithoutNextMentoria = businesses.filter(b => !b.proxima_mentoria)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHandshake} className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Minhas Mentorias</h1>
              <p className="text-white/90 text-xl">Gerencie seus negócios vinculados e acompanhe o progresso</p>
              <p className="text-white/80 text-base">Conecte-se com empreendedores e faça a diferença</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Negócios Vinculados</p>
                <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Próximas Mentorias</p>
                <p className="text-2xl font-bold text-gray-900">{businessesWithNextMentoria.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Mentorias Finalizadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {businesses.reduce((total, b) => total + b.mentorias_finalizadas, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Businesses List - Grid Layout */}
      <div className="space-y-6">
        {businesses.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FontAwesomeIcon icon={faBuilding} className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum negócio vinculado</h3>
              <p className="text-gray-600">Você ainda não possui negócios vinculados para mentoria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.negocio_id} className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  {/* Header do Card */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{business.negocio_nome}</h3>
                      <Badge className="bg-stone-green-light/10 text-stone-green-dark border-0 mt-1 text-xs">
                        {business.area_atuacao}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Informações do Empreendedor */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-stone-green-dark" />
                      <span className="font-medium">{business.empreendedor_nome}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <button
                        onClick={() => handleContact(business.telefone)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-900 hover:text-green-600 transition-colors">{business.telefone}</span>
                      </button>
                    </div>
                    {business.localizacao && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-stone-green-dark" />
                        <span className="font-medium">{business.localizacao}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats da Mentoria */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartLine} className="h-4 w-4 text-stone-green-dark" />
                      <span className="font-medium">{business.total_mentorias} total</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-stone-green-dark" />
                      <span className="font-medium">{business.mentorias_finalizadas} finalizadas</span>
                    </div>
                  </div>

                  {/* Status da Próxima Mentoria */}
                  {business.proxima_mentoria ? (
                    <div className="space-y-3 mb-4">
                      <div className="p-4 bg-gradient-to-r from-stone-green-light/10 to-stone-green-dark/10 rounded-lg border border-stone-green-light/30">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-lg flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {getTipoText(business.proxima_mentoria.tipo)}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDateTimeToBR(business.proxima_mentoria.data_agendada)}
                            </p>
                          </div>
                          <Badge className={`text-xs border-0 ${
                            business.proxima_mentoria.status === 'confirmada' 
                              ? 'bg-green-100 text-green-700' 
                              : business.proxima_mentoria.status === 'andamento'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-stone-green-light/20 text-stone-green-dark'
                          }`}>
                            <FontAwesomeIcon 
                              icon={getStatusIcon(business.proxima_mentoria.status)} 
                              className="h-3 w-3 mr-1" 
                            />
                            {getStatusText(business.proxima_mentoria.status)}
                          </Badge>
                        </div>
                        
                        {/* Detalhes da Mentoria */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3 text-stone-green-dark" />
                            <span className="text-gray-600">
                              {business.proxima_mentoria.duracao_minutos} min
                            </span>
                          </div>
                          {business.proxima_mentoria.confirmada_at && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-green-500" />
                              <span className="text-gray-600">
                                Confirmada
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Botões - Mostra ambos se há mentorias finalizadas */}
                      {business.mentorias_finalizadas > 0 ? (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => (window.location.href = `/mentor/mentorias/historico/${business.negocio_id}`)}
                            className="flex-1 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-10 text-sm"
                          >
                            <FontAwesomeIcon icon={faHistory} className="h-4 w-4 mr-2" />
                            Ver Histórico
                          </Button>
                          <Button
                            onClick={() => business.proxima_mentoria && (window.location.href = `/mentor/mentorias/${business.proxima_mentoria.id}`)}
                            className="flex-1 bg-none border-2 border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white shadow-lg h-10 text-sm"
                          >
                            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => business.proxima_mentoria && (window.location.href = `/mentor/mentorias/${business.proxima_mentoria.id}`)}
                          className="w-full bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-10 text-sm"
                        >
                          <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      )}
                    </div>
                  ) : business.mentorias_finalizadas > 0 ? (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">Marque sua próxima mentoria</p>
                          <p className="text-xs text-gray-600">Continue o acompanhamento</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => (window.location.href = `/mentor/mentorias/historico/${business.negocio_id}`)}
                          className="flex-1 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-10 text-sm"
                        >
                          <FontAwesomeIcon icon={faHistory} className="h-4 w-4 mr-2" />
                          Ver Histórico
                        </Button>
                        {/* <Button
                          onClick={() => business.proxima_mentoria && (window.location.href = `/mentor/mentorias/${business.proxima_mentoria.id}`)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg h-10 text-sm"
                        >
                          <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button> */}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">Agende sua primeira data de mentoria</p>
                          <p className="text-xs text-gray-600">Nenhuma mentoria agendada</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Botões de Ação */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleContact(business.telefone)}
                      variant="outline"
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-500 hover:text-white h-10 text-sm"
                    >
                      <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                    <Button
                      onClick={() => handleScheduleSession(business)}
                      className="flex-1 bg-none border-2 border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white"
                    >
                      <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4 mr-2" />
                      {business.proxima_mentoria ? "Editar" : "Agendar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Card "Novas mentorias em breve" */}
            <Card className="border-0 opacity-50 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Novas mentorias em breve</h3>
                  <p className="text-sm text-gray-600 mb-4">Mais oportunidades de mentoria serão adicionadas em breve</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                    <span>Em desenvolvimento</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Schedule Mentoria Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {selectedBusiness?.proxima_mentoria ? "Editar Mentoria" : "Agendar Mentoria"}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {selectedBusiness?.proxima_mentoria 
                ? `Edite a mentoria agendada para "${selectedBusiness?.negocio_nome}"`
                : `Agende uma nova mentoria para "${selectedBusiness?.negocio_nome}"`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="data_agendada" className="text-sm font-medium text-gray-700">Data e Hora *</Label>
              <Input
                id="data_agendada"
                type="datetime-local"
                value={scheduleForm.data_agendada}
                onChange={(e) => setScheduleForm({ ...scheduleForm, data_agendada: e.target.value })}
                className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="duracao" className="text-sm font-medium text-gray-700">Duração (minutos) *</Label>
              <Select value={scheduleForm.duracao_minutos.toString()} onValueChange={(value) => setScheduleForm({ ...scheduleForm, duracao_minutos: parseInt(value) })}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione a duração" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1h 30min</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleScheduleMentoria}
              disabled={!scheduleForm.data_agendada}
              className="px-6 py-2 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
            >
              <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4 mr-2" />
              {selectedBusiness?.proxima_mentoria ? "Salvar Alterações" : "Agendar Mentoria"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

