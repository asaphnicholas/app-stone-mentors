"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
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
  faArrowLeft,
  faClipboardList,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons"
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons"
import { mentoriasService, type Mentoria } from "@/lib/services/mentorias"
import { useToast } from "@/components/ui/toast"
import { formatDateToBR, formatDateTimeToBR } from "@/lib/utils/date"
import { DiagnosticoModal } from "@/components/ui/diagnostico-modal"

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
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
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

export default function MentoriaDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const mentoriaId = params.id as string
  
  const [mentoria, setMentoria] = useState<Mentoria | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Loading states for actions
  const [isConfirming, setIsConfirming] = useState(false)
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  // Modal states
  const [isDiagnosticDialogOpen, setIsDiagnosticDialogOpen] = useState(false)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
  const [isDiagnosticoDetailsOpen, setIsDiagnosticoDetailsOpen] = useState(false)
  const [diagnosticoDetails, setDiagnosticoDetails] = useState<any>(null)
  
  // Form states
  const [checkoutForm, setCheckoutForm] = useState({
    nota_mentoria: 0,
    nota_mentor: 0,
    nota_programa: 0,
    observacoes: "",
    proximos_passos: ""
  })

  const { addToast } = useToast()
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated && mentoriaId) {
      loadMentoriaDetails()
    }
  }, [isHydrated, mentoriaId])

  const loadMentoriaDetails = async () => {
    try {
      setIsLoading(true)
      const mentoriaData = await mentoriasService.getMentoriaDetails(mentoriaId)
      setMentoria(mentoriaData)
      
      
      // Preencher formulário de checkout se já existir
      if (mentoriaData.checkout) {
        setCheckoutForm({
          nota_mentoria: mentoriaData.checkout.nota_mentoria || 0,
          nota_mentor: mentoriaData.checkout.nota_mentor || 0,
          nota_programa: mentoriaData.checkout.nota_programa || 0,
          observacoes: mentoriaData.checkout.observacoes || "",
          proximos_passos: mentoriaData.checkout.proximos_passos || ""
        })
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar mentoria",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
      router.push("/mentor/mentorias")
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmMentoria = async () => {
    if (!mentoria) return

    try {
      setIsConfirming(true)
      await mentoriasService.confirmMentoria(mentoria.mentoria_id)
      
      addToast({
        type: "success",
        title: "Mentoria confirmada!",
        message: `Mentoria para "${mentoria.negocio.nome}" foi confirmada com sucesso.`,
      })
      
      loadMentoriaDetails()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao confirmar mentoria",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsConfirming(false)
    }
  }

  const handleCheckinMentoria = async () => {
    if (!mentoria) return

    try {
      setIsCheckingIn(true)
      await mentoriasService.checkinMentoria(mentoria.mentoria_id)
      
      addToast({
        type: "success",
        title: "Check-in realizado!",
        message: `Mentoria iniciada para "${mentoria.negocio.nome}". Diagnóstico disponível.`,
      })
      
      loadMentoriaDetails()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao fazer check-in",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsCheckingIn(false)
    }
  }


  const handleCheckoutMentoria = async () => {
    if (!mentoria) return

    try {
      setIsCheckingOut(true)
      await mentoriasService.checkoutMentoria(mentoria.mentoria_id, checkoutForm)
      
      addToast({
        type: "success",
        title: "Mentoria finalizada!",
        message: `Mentoria para "${mentoria.negocio.nome}" foi finalizada com sucesso.`,
      })
      
      setIsCheckoutDialogOpen(false)
      loadMentoriaDetails()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao finalizar mentoria",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsCheckingOut(false)
    }
  }

  const handleViewDiagnosticoDetails = async () => {
    if (!mentoria?.diagnostico?.id) return

    try {
      const details = await mentoriasService.getDiagnosticoById(mentoria.diagnostico.id)
      setDiagnosticoDetails(details)
      setIsDiagnosticoDetailsOpen(true)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar diagnóstico",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-700 border-green-200'
      case 'em_andamento': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'disponivel': return 'bg-stone-green-light/20 text-stone-green-dark border-stone-green-light/30'
      case 'finalizada': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmada': return faCheckCircle
      case 'em_andamento': return faPlay
      case 'disponivel': return faCalendarAlt
      case 'finalizada': return faCheckCircle
      default: return faClock
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmada': return 'Confirmada'
      case 'em_andamento': return 'Em andamento'
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

  if (!mentoria) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/mentor/mentorias")}
            className="flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
            Voltar
          </Button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mentoria não encontrada</h3>
            <p className="text-gray-600">A mentoria solicitada não foi encontrada ou você não tem acesso a ela.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/mentor/mentorias")}
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Detalhes da Mentoria</h1>
          <p className="text-gray-600">Gerencie esta sessão de mentoria</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações do Negócio */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-white" />
              </div>
              Informações do Negócio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-stone-green-dark" />
                <div>
                  <p className="font-semibold text-gray-900">{mentoria.negocio.nome}</p>
                  <p className="text-sm text-gray-600">{mentoria.negocio.area_atuacao}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-stone-green-dark" />
                <div>
                  <p className="font-semibold text-gray-900">{mentoria.negocio.empreendedor_nome}</p>
                  <p className="text-sm text-gray-600">Empreendedor</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-stone-green-dark" />
                <div>
                  <p className="font-semibold text-gray-900">{mentoria.negocio.telefone}</p>
                  <p className="text-sm text-gray-600">Contato</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-stone-green-dark" />
                <div>
                  <p className="font-semibold text-gray-900">{mentoria.negocio.localizacao}</p>
                  <p className="text-sm text-gray-600">Localização</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  // Remove caracteres especiais do telefone para o WhatsApp
                  const cleanPhone = mentoria.negocio.telefone.replace(/\D/g, '')
                  // Adiciona código do Brasil se não tiver
                  const whatsappPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
                  // Abre WhatsApp Web
                  window.open(`https://wa.me/${whatsappPhone}`, '_blank')
                }}
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="h-4 w-4 mr-2" />
                Contatar no WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status da Mentoria */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-white" />
              </div>
              Status da Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Tipo:</span>
                <Badge className="bg-stone-green-light/10 text-stone-green-dark border-0">
                  {getTipoText(mentoria.tipo)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Status:</span>
                <Badge className={`text-xs border ${getStatusColor(mentoria.status)}`}>
                  <FontAwesomeIcon icon={getStatusIcon(mentoria.status)} className="h-3 w-3 mr-1" />
                  {getStatusText(mentoria.status)}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Data Agendada:</span>
                <span className="font-semibold text-gray-900">{formatDateTimeToBR(mentoria.data_agendada)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Duração:</span>
                <span className="font-semibold text-gray-900">{mentoria.duracao_minutos} minutos</span>
              </div>
              
              {mentoria.confirmada_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Confirmada em:</span>
                  <span className="font-semibold text-gray-900">{formatDateToBR(mentoria.confirmada_at)}</span>
                </div>
              )}
              
              {mentoria.checkin_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Check-in em:</span>
                  <span className="font-semibold text-gray-900">{formatDateToBR(mentoria.checkin_at)}</span>
                </div>
              )}
              
              {mentoria.finalizada_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Finalizada em:</span>
                  <span className="font-semibold text-gray-900">{formatDateToBR(mentoria.finalizada_at)}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progresso da Mentoria */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
            </div>
            Progresso da Mentoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {/* Passo 1: Confirmar */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                mentoria.status === 'disponivel' 
                  ? 'bg-stone-green-dark text-white' 
                  : 'bg-green-500 text-white'
              }`}>
                <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Confirmar</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                mentoria.status === 'disponivel' 
                  ? 'bg-stone-green-light/20 text-stone-green-dark' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {mentoria.status === 'disponivel' ? 'Pendente' : 'Concluído'}
              </span>
            </div>

            {/* Seta */}
            <div className="flex-1 h-0.5 bg-gray-200 relative">
              <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                mentoria.status !== 'disponivel' ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ width: mentoria.status !== 'disponivel' ? '100%' : '0%' }}></div>
            </div>

            {/* Passo 2: Check-in */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                mentoria.checkin_at 
                  ? 'bg-green-500 text-white' 
                  : mentoria.status === 'confirmada'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Check-in</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                mentoria.checkin_at 
                  ? 'bg-green-100 text-green-700' 
                  : mentoria.status === 'confirmada'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {mentoria.checkin_at ? 'Concluído' : mentoria.status === 'confirmada' ? 'Disponível' : 'Bloqueado'}
              </span>
            </div>

            {/* Seta */}
            <div className="flex-1 h-0.5 bg-gray-200 relative">
              <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                mentoria.checkin_at ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ width: mentoria.checkin_at ? '100%' : '0%' }}></div>
            </div>

            {/* Passo 3: Diagnóstico */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                mentoria.diagnostico 
                  ? 'bg-green-500 text-white' 
                  : mentoria.checkin_at
                  ? 'bg-stone-green-dark text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Diagnóstico</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                mentoria.diagnostico 
                  ? 'bg-green-100 text-green-700' 
                  : mentoria.checkin_at
                  ? 'bg-stone-green-light/20 text-stone-green-dark'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {mentoria.diagnostico ? 'Concluído' : mentoria.checkin_at ? 'Disponível' : 'Bloqueado'}
              </span>
            </div>

            {/* Seta */}
            <div className="flex-1 h-0.5 bg-gray-200 relative">
              <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                mentoria.diagnostico ? 'bg-green-500' : 'bg-gray-200'
              }`} style={{ width: mentoria.diagnostico ? '100%' : '0%' }}></div>
            </div>

            {/* Passo 4: Checkout */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                mentoria.finalizada_at 
                  ? 'bg-green-500 text-white' 
                  : mentoria.checkin_at
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-300 text-gray-500'
              }`}>
                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">Checkout</span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                mentoria.finalizada_at 
                  ? 'bg-green-100 text-green-700' 
                  : mentoria.checkin_at
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {mentoria.finalizada_at ? 'Concluído' : mentoria.checkin_at ? 'Disponível' : 'Bloqueado'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações da Mentoria */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHandshake} className="h-5 w-5 text-white" />
            </div>
            Ações da Mentoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Confirmar Mentoria */}
            {mentoria.status === 'disponivel' && (
              <Button
                onClick={handleConfirmMentoria}
                disabled={isConfirming}
                className="h-16 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  {isConfirming ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isConfirming ? 'Confirmando...' : 'Confirmar'}
                  </span>
                </div>
              </Button>
            )}

            {/* Check-in */}
            {mentoria.status === 'confirmada' && (
              <Button
                onClick={handleCheckinMentoria}
                disabled={isCheckingIn}
                className="h-16 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center gap-2">
                  {isCheckingIn ? (
                    <FontAwesomeIcon icon={faSpinner} className="h-5 w-5 animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
                  )}
                  <span className="text-sm font-medium">
                    {isCheckingIn ? 'Fazendo check-in...' : 'Check-in'}
                  </span>
                </div>
              </Button>
            )}

            {/* Diagnóstico - Só disponível após checkin ou quando status é andamento */}
            {(mentoria.status === 'em_andamento' && mentoria.checkin_at) || (mentoria.status as string) === 'andamento' ? (
              <Button
                onClick={() => setIsDiagnosticDialogOpen(true)}
                className="h-16 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
                  <span className="text-sm font-medium">Diagnóstico</span>
                </div>
              </Button>
            ) : null}

            {/* Checkout - Só disponível após checkin ou quando status é andamento */}
            {(mentoria.status === 'em_andamento' && mentoria.checkin_at) || (mentoria.status as string) === 'andamento' ? (
              <Button
                onClick={() => setIsCheckoutDialogOpen(true)}
                className="h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                  <span className="text-sm font-medium">Checkout</span>
                </div>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      {mentoria.diagnostico && (
        <div className="space-y-6">
          {/* Identificação do Empreendedor */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
              </div>
                Identificação do Empreendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentoria.diagnostico.nome_completo && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome Completo:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.nome_completo}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.email && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">E-mail:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.email}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.telefone_whatsapp && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telefone WhatsApp:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.telefone_whatsapp}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.status_negocio && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status do Negócio:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.status_negocio}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.tempo_funcionamento && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tempo de Funcionamento:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.tempo_funcionamento}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.setor_atuacao && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Setor de Atuação:</p>
                    <p className="font-semibold text-gray-900">{mentoria.diagnostico.setor_atuacao}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Avaliação de Maturidade */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
                </div>
                Avaliação de Maturidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'organizacao_financeira', label: 'Organização Financeira e Controle de Despesas' },
                  { key: 'divulgacao_marketing', label: 'Divulgação, Marketing e Produção de Conteúdo' },
                  { key: 'estrategia_comercial', label: 'Estratégia Comercial e Vendas' },
                  { key: 'relacionamento_cliente', label: 'Relacionamento e Atendimento ao Cliente' },
                  { key: 'ferramentas_digitais', label: 'Uso de Ferramentas Digitais, Aplicativos e Planilhas' },
                  { key: 'planejamento_gestao', label: 'Planejamento, Gestão do Tempo e Organização de Processos' },
                  { key: 'conhecimento_legal', label: 'Conhecimento das Obrigações Legais e Jurídicas do Negócio' }
                ].map((item) => {
                  const value = mentoria.diagnostico?.[item.key as keyof typeof mentoria.diagnostico] as number
                  if (!value) return null
                  
                  return (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-stone-green-dark">{value}/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-stone-green-dark to-stone-green-light h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(value / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Dor Principal */}
          {mentoria.diagnostico.dor_principal && (
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
                  </div>
                  Dor Principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  {mentoria.diagnostico.dor_principal}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Teste Psicométrico */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-white" />
                </div>
                Teste Psicométrico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mentoria.diagnostico.perfil_risco && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Perfil de Risco:</p>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-1">
                      {mentoria.diagnostico.perfil_risco}
                    </Badge>
                  </div>
                )}
                
                {mentoria.diagnostico.questao_logica && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Questão Lógica:</p>
                    <p className="font-semibold text-gray-900 mt-1">{mentoria.diagnostico.questao_logica}</p>
                  </div>
                )}
                
                {mentoria.diagnostico.questao_memoria && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Questão de Memória:</p>
                    <p className="font-semibold text-gray-900 mt-1">{mentoria.diagnostico.questao_memoria}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Perfil de Personalidade */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-white" />
                </div>
                Perfil de Personalidade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { key: 'personalidade_agir_primeiro', label: 'Prefiro agir primeiro e me preocupar depois' },
                  { key: 'personalidade_solucoes_problemas', label: 'Gosto de pensar em várias soluções para um problema' },
                  { key: 'personalidade_pressentimento', label: 'Sigo primeiro meu pressentimento' },
                  { key: 'personalidade_prazo', label: 'Faço as coisas antes do prazo' },
                  { key: 'personalidade_fracasso_opcao', label: 'Fracasso não é uma opção para mim' },
                  { key: 'personalidade_decisao_correta', label: 'Minhas decisões sobre negócio são sempre corretas' },
                  { key: 'personalidade_oportunidades_riscos', label: 'Foco mais em oportunidades do que em riscos' },
                  { key: 'personalidade_sucesso', label: 'Sempre acreditei que teria sucesso' }
                ].map((item) => {
                  const value = mentoria.diagnostico?.[item.key as keyof typeof mentoria.diagnostico] as number
                  if (!value) return null
                  
                  return (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                        <span className="text-sm font-bold text-stone-green-dark">{value}/4</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(value / 4) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Informações Complementares */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-white" />
                  </div>
                  Informações Complementares
                </div>
                <Button
                  onClick={handleViewDiagnosticoDetails}
                  variant="outline"
                  size="sm"
                  className="border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white"
                >
                  <FontAwesomeIcon icon={faClipboardList} className="h-4 w-4 mr-2" />
                  Ver Diagnóstico Completo
                </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentoria.diagnostico.tempo_mercado && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Tempo no Mercado:</p>
                  <p className="font-semibold text-gray-900">{mentoria.diagnostico.tempo_mercado}</p>
                </div>
              )}
              
              {mentoria.diagnostico.faturamento_mensal && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Faturamento Mensal:</p>
                    <p className="font-semibold text-gray-900">R$ {mentoria.diagnostico.faturamento_mensal}</p>
                </div>
              )}
              
              {mentoria.diagnostico.num_funcionarios && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Número de Funcionários:</p>
                  <p className="font-semibold text-gray-900">{mentoria.diagnostico.num_funcionarios}</p>
                </div>
              )}
            </div>
            
            {mentoria.diagnostico.desafios && mentoria.diagnostico.desafios.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Desafios Identificados:</p>
                <div className="flex flex-wrap gap-2">
                  {mentoria.diagnostico.desafios.map((desafio, index) => (
                    <Badge key={index} className="bg-orange-100 text-orange-700 border-orange-200">
                      {desafio}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {mentoria.diagnostico.observacoes && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Observações:</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{mentoria.diagnostico.observacoes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      )}

      {/* Checkout */}
      {mentoria.checkout && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 text-white" />
              </div>
              Checkout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mentoria.checkout.observacoes && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Observações Finais:</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{mentoria.checkout.observacoes}</p>
              </div>
            )}
            
            {mentoria.checkout.proximos_passos && (
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Próximos Passos:</p>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{mentoria.checkout.proximos_passos}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal de Diagnóstico */}
      <DiagnosticoModal
        mentoriaId={mentoria.mentoria_id}
        negocioNome={mentoria.negocio.nome}
        isOpen={isDiagnosticDialogOpen}
        onClose={() => setIsDiagnosticDialogOpen(false)}
        onSuccess={() => {
          loadMentoriaDetails()
          setIsDiagnosticDialogOpen(false)
        }}
      />

      {/* Modal de Checkout */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Finalizar Mentoria</DialogTitle>
            <DialogDescription className="text-gray-600">
              Finalize a mentoria de "{mentoria.negocio.nome}" e deixe suas observações
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Avaliação da Mentoria */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Como foi a mentoria?
              </Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">0</span>
                  <div className="flex-1 mx-4">
                    <Slider
                      value={[checkoutForm.nota_mentoria]}
                      onValueChange={(value) => setCheckoutForm({ ...checkoutForm, nota_mentoria: value[0] })}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full slider-green"
                    />
                  </div>
                  <span className="text-sm text-gray-600">10</span>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-stone-green-dark">
                    {checkoutForm.nota_mentoria}
                  </div>
                  {/* <div className="text-xs text-gray-600">
                    {checkoutForm.nota_mentoria >= 9 ? "Promotor" : 
                     checkoutForm.nota_mentoria >= 7 ? "Neutro" : 
                     checkoutForm.nota_mentoria > 0 ? "Detrator" : "Não avaliado"}
                  </div> */}
                </div>
              </div>
            </div>


            <div className="space-y-3">
              <Label htmlFor="checkout_observacoes" className="text-sm font-medium text-gray-700">Observações Finais</Label>
              <Textarea
                id="checkout_observacoes"
                value={checkoutForm.observacoes}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, observacoes: e.target.value })}
                placeholder="Descreva como foi a mentoria, pontos positivos, etc..."
                className="min-h-[80px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="proximos_passos" className="text-sm font-medium text-gray-700">Próximos Passos</Label>
              <Select 
                value={checkoutForm.proximos_passos} 
                onValueChange={(value) => setCheckoutForm({ ...checkoutForm, proximos_passos: value })}
              >
                <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione os próximos passos..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nova_mentoria">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4 text-green-600" />
                      <span>Agendar Nova Mentoria</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="finalizar">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-red-600" />
                      <span>Finalizar Processo</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsCheckoutDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCheckoutMentoria}
              disabled={checkoutForm.nota_mentoria === 0 || !checkoutForm.proximos_passos || isCheckingOut}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? (
                <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2" />
              )}
              {isCheckingOut ? 'Finalizando...' : 'Finalizar Mentoria'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Diagnóstico */}
      <Dialog open={isDiagnosticoDetailsOpen} onOpenChange={setIsDiagnosticoDetailsOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] lg:max-w-7xl xl:max-w-[90vw] p-0 bg-white flex flex-col">
          <DialogHeader className="p-6 pb-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faClipboardList} className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Diagnóstico Completo
                  </DialogTitle>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-stone-green-light/20 text-stone-green-dark border-0 px-3 py-1">
                      {diagnosticoDetails?.negocio?.nome || 'Carregando...'}
                    </Badge>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {diagnosticoDetails?.created_at ? formatDateTimeToBR(diagnosticoDetails.created_at) : 'Carregando...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto min-h-0 p-6">
            {diagnosticoDetails ? (
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Identificação do Empreendedor */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
                      </div>
                      Identificação do Empreendedor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {diagnosticoDetails.nome_completo && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Nome Completo:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.nome_completo}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.email && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">E-mail:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.email}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.telefone_whatsapp && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Telefone WhatsApp:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.telefone_whatsapp}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.status_negocio && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Status do Negócio:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.status_negocio}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.tempo_funcionamento && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tempo de Funcionamento:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.tempo_funcionamento}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.setor_atuacao && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Setor de Atuação:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.setor_atuacao}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Avaliação de Maturidade */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
                      </div>
                      Avaliação de Maturidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { key: 'organizacao_financeira', label: 'Organização Financeira e Controle de Despesas' },
                        { key: 'divulgacao_marketing', label: 'Divulgação, Marketing e Produção de Conteúdo' },
                        { key: 'estrategia_comercial', label: 'Estratégia Comercial e Vendas' },
                        { key: 'relacionamento_cliente', label: 'Relacionamento e Atendimento ao Cliente' },
                        { key: 'ferramentas_digitais', label: 'Uso de Ferramentas Digitais, Aplicativos e Planilhas' },
                        { key: 'planejamento_gestao', label: 'Planejamento, Gestão do Tempo e Organização de Processos' },
                        { key: 'conhecimento_legal', label: 'Conhecimento das Obrigações Legais e Jurídicas do Negócio' }
                      ].map((item) => {
                        const value = diagnosticoDetails[item.key]
                        if (!value) return null
                        
                        return (
                          <div key={item.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{item.label}</span>
                              <span className="text-sm font-bold text-stone-green-dark">{value}/5</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-stone-green-dark to-stone-green-light h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(value / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Dor Principal */}
                {diagnosticoDetails.dor_principal && (
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
                        </div>
                        Dor Principal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                        {diagnosticoDetails.dor_principal}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Teste Psicométrico */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-white" />
                      </div>
                      Teste Psicométrico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {diagnosticoDetails.perfil_risco && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Perfil de Risco:</p>
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mt-1">
                            {diagnosticoDetails.perfil_risco}
                          </Badge>
                        </div>
                      )}
                      
                      {diagnosticoDetails.questao_logica && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Questão Lógica:</p>
                          <p className="font-semibold text-gray-900 mt-1">{diagnosticoDetails.questao_logica}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.questao_memoria && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Questão de Memória:</p>
                          <p className="font-semibold text-gray-900 mt-1">{diagnosticoDetails.questao_memoria}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Perfil de Personalidade */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-white" />
                      </div>
                      Perfil de Personalidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { key: 'personalidade_agir_primeiro', label: 'Prefiro agir primeiro e me preocupar depois' },
                        { key: 'personalidade_solucoes_problemas', label: 'Gosto de pensar em várias soluções para um problema' },
                        { key: 'personalidade_pressentimento', label: 'Sigo primeiro meu pressentimento' },
                        { key: 'personalidade_prazo', label: 'Faço as coisas antes do prazo' },
                        { key: 'personalidade_fracasso_opcao', label: 'Fracasso não é uma opção para mim' },
                        { key: 'personalidade_decisao_correta', label: 'Minhas decisões sobre negócio são sempre corretas' },
                        { key: 'personalidade_oportunidades_riscos', label: 'Foco mais em oportunidades do que em riscos' },
                        { key: 'personalidade_sucesso', label: 'Sempre acreditei que teria sucesso' }
                      ].map((item) => {
                        const value = diagnosticoDetails[item.key]
                        if (!value) return null
                        
                        return (
                          <div key={item.key} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">{item.label}</span>
                              <span className="text-sm font-bold text-stone-green-dark">{value}/4</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(value / 4) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Informações Complementares */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-white" />
                      </div>
                      Informações Complementares
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {diagnosticoDetails.tempo_mercado && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Tempo no Mercado:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.tempo_mercado}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.faturamento_mensal && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Faturamento Mensal:</p>
                          <p className="font-semibold text-gray-900">R$ {diagnosticoDetails.faturamento_mensal}</p>
                        </div>
                      )}
                      
                      {diagnosticoDetails.num_funcionarios && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Número de Funcionários:</p>
                          <p className="font-semibold text-gray-900">{diagnosticoDetails.num_funcionarios}</p>
                        </div>
                      )}
                    </div>
                    
                    {diagnosticoDetails.desafios && diagnosticoDetails.desafios.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Desafios Identificados:</p>
                        <div className="flex flex-wrap gap-2">
                          {diagnosticoDetails.desafios.map((desafio: string, index: number) => (
                            <Badge key={index} className="bg-orange-100 text-orange-700 border-orange-200">
                              {desafio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {diagnosticoDetails.observacoes && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">Observações:</p>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{diagnosticoDetails.observacoes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-green-light border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600 text-lg">Carregando diagnóstico...</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDiagnosticoDetailsOpen(false)}
                className="px-6 py-3 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
