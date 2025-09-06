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
import { formatDateToBR } from "@/lib/utils/date"

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
  
  // Modal states
  const [isDiagnosticDialogOpen, setIsDiagnosticDialogOpen] = useState(false)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)
  
  // Form states
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
    if (isHydrated && mentoriaId) {
      loadMentoriaDetails()
    }
  }, [isHydrated, mentoriaId])

  const loadMentoriaDetails = async () => {
    try {
      setIsLoading(true)
      const mentoriaData = await mentoriasService.getMentoriaDetails(mentoriaId)
      setMentoria(mentoriaData)
      
      // Preencher formulário de diagnóstico se já existir
      if (mentoriaData.diagnostico) {
        setDiagnosticForm({
          tempo_mercado: mentoriaData.diagnostico.tempo_mercado || "",
          faturamento_mensal: mentoriaData.diagnostico.faturamento_mensal || "",
          num_funcionarios: mentoriaData.diagnostico.num_funcionarios || "",
          desafios: mentoriaData.diagnostico.desafios || [],
          observacoes: mentoriaData.diagnostico.observacoes || ""
        })
      }
      
      // Preencher formulário de checkout se já existir
      if (mentoriaData.checkout) {
        setCheckoutForm({
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
    }
  }

  const handleCheckinMentoria = async () => {
    if (!mentoria) return

    try {
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
    }
  }

  const handleUpdateDiagnostico = async () => {
    if (!mentoria) return

    try {
      await mentoriasService.updateDiagnostico(mentoria.mentoria_id, diagnosticForm)
      
      addToast({
        type: "success",
        title: "Diagnóstico atualizado!",
        message: "Diagnóstico da mentoria foi atualizado com sucesso.",
      })
      
      setIsDiagnosticDialogOpen(false)
      loadMentoriaDetails()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao atualizar diagnóstico",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const handleCheckoutMentoria = async () => {
    if (!mentoria) return

    try {
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
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-700 border-green-200'
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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
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
                <span className="font-semibold text-gray-900">{formatDateToBR(mentoria.data_agendada)}</span>
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
                className="h-16 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faCheck} className="h-5 w-5" />
                  <span className="text-sm font-medium">Confirmar</span>
                </div>
              </Button>
            )}

            {/* Check-in */}
            {mentoria.status === 'confirmada' && (
              <Button
                onClick={handleCheckinMentoria}
                className="h-16 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faPlay} className="h-5 w-5" />
                  <span className="text-sm font-medium">Check-in</span>
                </div>
              </Button>
            )}

            {/* Diagnóstico */}
            {(mentoria.status === 'confirmada' || mentoria.status === 'em_andamento') && (
              <Button
                onClick={() => setIsDiagnosticDialogOpen(true)}
                variant="outline"
                className="h-16 border-2 border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
                  <span className="text-sm font-medium">Diagnóstico</span>
                </div>
              </Button>
            )}

            {/* Checkout */}
            {(mentoria.status === 'confirmada' || mentoria.status === 'em_andamento') && (
              <Button
                onClick={() => setIsCheckoutDialogOpen(true)}
                variant="outline"
                className="h-16 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                  <span className="text-sm font-medium">Checkout</span>
                </div>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Diagnóstico */}
      {mentoria.diagnostico && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-white" />
              </div>
              Diagnóstico
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
                  <p className="font-semibold text-gray-900">{mentoria.diagnostico.faturamento_mensal}</p>
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
      <Dialog open={isDiagnosticDialogOpen} onOpenChange={setIsDiagnosticDialogOpen}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Diagnóstico da Mentoria</DialogTitle>
            <DialogDescription className="text-gray-600">
              Preencha o diagnóstico para a mentoria de "{mentoria.negocio.nome}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="tempo_mercado" className="text-sm font-medium text-gray-700">Tempo no Mercado</Label>
                <Select value={diagnosticForm.tempo_mercado} onValueChange={(value) => setDiagnosticForm({ ...diagnosticForm, tempo_mercado: value })}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                    <SelectValue placeholder="Selecione o tempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menos de 1 ano">Menos de 1 ano</SelectItem>
                    <SelectItem value="1-2 anos">1-2 anos</SelectItem>
                    <SelectItem value="3-5 anos">3-5 anos</SelectItem>
                    <SelectItem value="6-10 anos">6-10 anos</SelectItem>
                    <SelectItem value="Mais de 10 anos">Mais de 10 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="faturamento_mensal" className="text-sm font-medium text-gray-700">Faturamento Mensal</Label>
                <Select value={diagnosticForm.faturamento_mensal} onValueChange={(value) => setDiagnosticForm({ ...diagnosticForm, faturamento_mensal: value })}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                    <SelectValue placeholder="Selecione o faturamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Até R$ 5.000">Até R$ 5.000</SelectItem>
                    <SelectItem value="R$ 5.000 - R$ 10.000">R$ 5.000 - R$ 10.000</SelectItem>
                    <SelectItem value="R$ 10.000 - R$ 50.000">R$ 10.000 - R$ 50.000</SelectItem>
                    <SelectItem value="R$ 50.000 - R$ 100.000">R$ 50.000 - R$ 100.000</SelectItem>
                    <SelectItem value="Acima de R$ 100.000">Acima de R$ 100.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="num_funcionarios" className="text-sm font-medium text-gray-700">Número de Funcionários</Label>
              <Select value={diagnosticForm.num_funcionarios} onValueChange={(value) => setDiagnosticForm({ ...diagnosticForm, num_funcionarios: value })}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione o número" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apenas o empreendedor">Apenas o empreendedor</SelectItem>
                  <SelectItem value="2-5 funcionários">2-5 funcionários</SelectItem>
                  <SelectItem value="6-10 funcionários">6-10 funcionários</SelectItem>
                  <SelectItem value="11-20 funcionários">11-20 funcionários</SelectItem>
                  <SelectItem value="Mais de 20 funcionários">Mais de 20 funcionários</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
              <Textarea
                id="observacoes"
                value={diagnosticForm.observacoes}
                onChange={(e) => setDiagnosticForm({ ...diagnosticForm, observacoes: e.target.value })}
                placeholder="Descreva suas observações sobre a mentoria..."
                className="min-h-[100px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsDiagnosticDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateDiagnostico}
              className="px-6 py-2 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
            >
              <FontAwesomeIcon icon={faCheck} className="h-4 w-4 mr-2" />
              Salvar Diagnóstico
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Checkout */}
      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Finalizar Mentoria</DialogTitle>
            <DialogDescription className="text-gray-600">
              Finalize a mentoria de "{mentoria.negocio.nome}" e deixe suas observações
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="checkout_observacoes" className="text-sm font-medium text-gray-700">Observações Finais</Label>
              <Textarea
                id="checkout_observacoes"
                value={checkoutForm.observacoes}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, observacoes: e.target.value })}
                placeholder="Descreva como foi a mentoria, pontos positivos, etc..."
                className="min-h-[100px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="proximos_passos" className="text-sm font-medium text-gray-700">Próximos Passos</Label>
              <Textarea
                id="proximos_passos"
                value={checkoutForm.proximos_passos}
                onChange={(e) => setCheckoutForm({ ...checkoutForm, proximos_passos: e.target.value })}
                placeholder="Defina os próximos passos para o empreendedor..."
                className="min-h-[100px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
              />
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
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4 mr-2" />
              Finalizar Mentoria
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
