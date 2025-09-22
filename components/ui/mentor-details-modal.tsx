"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUser,
  faPhone,
  faEnvelope,
  faBuilding,
  faGraduationCap,
  faTools,
  faCheckCircle,
  faClock,
  faUserCheck,
  faChartLine,
  faUsers,
  faHandshake,
  faCalendarAlt,
  faBusinessTime,
  faClipboardCheck,
  faComment,
  faArrowRight,
  faTimes,
  faExclamationTriangle,
  faRocket,
  faEdit,
  faMapMarkerAlt,
  faBriefcase,
  faPlay as faPlayIcon
} from "@fortawesome/free-solid-svg-icons"
import { mentorsService } from "@/lib/services/mentors"
import { formatDateToBR, formatDateTimeToBR } from "@/lib/utils/date"

interface MentorDetails {
  mentor: {
    id: string
    nome: string
    email: string
    telefone: string
    area_atuacao: string
    area_formacao: string
    competencias: string
    protocolo_concluido: boolean
    created_at: string
    last_login?: string
  }
  estatisticas: {
    total_mentorias: number
    mentorias_finalizadas: number
    mentorias_ativas: number
    nps_medio: number
    negocios_vinculados: number
  }
  negocios: Array<{
    id: string
    nome: string
    empreendedor_nome: string
    area_atuacao: string
    data_vinculacao: string
    status: string
  }>
  mentorias: Array<{
    id: string
    data_agendada: string
    tipo: string
    status: string
    duracao_minutos: number
    created_at: string
    confirmada_at?: string
    checkin_at?: string
    inicio_at?: string
    finalizada_at?: string
    negocio: {
      id: string
      nome: string
      empreendedor_nome: string
      area_atuacao: string
    }
    diagnostico?: {
      tempo_mercado?: string
      faturamento_mensal?: string
      numero_funcionarios?: string
      desafios_principais?: string
      observacoes?: string
    }
    checkout?: {
      nps?: number
      observacoes?: string
      proximos_passos?: string
      created_at?: string
    }
  }>
}

interface MentorDetailsModalProps {
  mentorId: string | null
  mentorName?: string
  isOpen: boolean
  onClose: () => void
}

export function MentorDetailsModal({ 
  mentorId, 
  mentorName,
  isOpen, 
  onClose
}: MentorDetailsModalProps) {
  const [mentorDetails, setMentorDetails] = useState<MentorDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && mentorId) {
      loadMentorDetails()
    }
  }, [isOpen, mentorId])

  const loadMentorDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const details = await mentorsService.getMentorHistorico(mentorId!)
      setMentorDetails(details)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar detalhes do mentor')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'disponivel':
        return 'Disponível'
      case 'confirmada':
        return 'Confirmada'
      case 'em_andamento':
      case 'andamento':
        return 'Em Andamento'
      case 'finalizada':
        return 'Finalizada'
      case 'ativo':
        return 'Ativo'
      case 'inativo':
        return 'Inativo'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch (status.toLowerCase()) {
      case 'disponivel':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmada':
        return 'bg-blue-100 text-blue-800'
      case 'em_andamento':
      case 'andamento':
        return 'bg-green-100 text-green-800'
      case 'finalizada':
        return 'bg-gray-100 text-gray-800'
      case 'ativo':
        return 'bg-green-100 text-green-800'
      case 'inativo':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTipoMentoriaText = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case 'primeira':
        return 'Primeira Mentoria'
      case 'follow_up':
        return 'Follow-up'
      default:
        return tipo
    }
  }

  const renderMentorDetails = () => {
    if (!mentorDetails) return null

    return (
      <div className="w-full h-full overflow-y-auto p-6 space-y-6">
        {/* Informações do Mentor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Informações do Mentor</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nome</p>
              <p className="font-semibold text-gray-900">{mentorDetails.mentor.nome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{mentorDetails.mentor.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefone</p>
              <p className="font-semibold text-gray-900">{mentorDetails.mentor.telefone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Área de Atuação</p>
              <p className="font-semibold text-gray-900">{mentorsService.getAreaAtuacaoLabel(mentorDetails.mentor.area_atuacao)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Área de Formação</p>
              <p className="font-semibold text-gray-900">{mentorsService.getAreaFormacaoLabel(mentorDetails.mentor.area_formacao)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status do Protocolo</p>
              <Badge className={mentorDetails.mentor.protocolo_concluido ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                {mentorDetails.mentor.protocolo_concluido ? 'Qualificado' : 'Pendente'}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data de Cadastro</p>
              <p className="font-semibold text-gray-900">{formatDateToBR(mentorDetails.mentor.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Último Login</p>
              <p className="font-semibold text-gray-900">
                {mentorDetails.mentor.last_login ? formatDateToBR(mentorDetails.mentor.last_login) : 'Nunca fez login'}
              </p>
            </div>
          </div>
          
          {mentorDetails.mentor.competencias && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Competências</p>
              <p className="text-gray-900 leading-relaxed">{mentorDetails.mentor.competencias}</p>
            </div>
          )}
        </div>

        {/* Estatísticas */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Estatísticas</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">{mentorDetails.estatisticas.total_mentorias}</p>
              <p className="text-sm text-gray-600">Total de Mentorias</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{mentorDetails.estatisticas.mentorias_ativas}</p>
              <p className="text-sm text-gray-600">Ativas</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{mentorDetails.estatisticas.mentorias_finalizadas}</p>
              <p className="text-sm text-gray-600">Finalizadas</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{mentorDetails.estatisticas.nps_medio.toFixed(1)}</p>
              <p className="text-sm text-gray-600">NPS Médio</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{mentorDetails.estatisticas.negocios_vinculados}</p>
              <p className="text-sm text-gray-600">Negócios</p>
            </div>
          </div>
        </div>

        {/* Negócios Vinculados */}
        {mentorDetails.negocios && mentorDetails.negocios.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faHandshake} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Negócios Vinculados</h3>
            </div>
            
            <div className="space-y-3">
              {mentorDetails.negocios.map((negocio) => (
                <div key={negocio.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-stone-600 to-stone-700 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{negocio.nome}</p>
                      <p className="text-sm text-gray-600">
                        {negocio.empreendedor_nome} • Vinculado em {formatDateToBR(negocio.data_vinculacao)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(negocio.status)}>
                    {getStatusText(negocio.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histórico de Mentorias */}
        {mentorDetails.mentorias && mentorDetails.mentorias.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Histórico de Mentorias</h3>
            </div>
            
            <div className="space-y-4">
              {mentorDetails.mentorias.map((mentoria) => (
                <div key={mentoria.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-stone-600 to-stone-700 rounded-lg flex items-center justify-center">
                        <FontAwesomeIcon icon={getStatusIcon(mentoria.status)} className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {getTipoMentoriaText(mentoria.tipo)} - {mentoria.negocio.nome}
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

                  {/* Informações do Negócio */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-gray-700">Empreendedor:</p>
                    <p className="text-sm text-gray-600">{mentoria.negocio.empreendedor_nome}</p>
                  </div>

                  {/* Diagnóstico */}
                  {mentoria.diagnostico && (
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm font-medium text-blue-700 mb-2">Diagnóstico:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {mentoria.diagnostico.tempo_mercado && (
                          <p><span className="font-medium">Tempo no mercado:</span> {mentoria.diagnostico.tempo_mercado}</p>
                        )}
                        {mentoria.diagnostico.faturamento_mensal && (
                          <p><span className="font-medium">Faturamento:</span> {mentoria.diagnostico.faturamento_mensal}</p>
                        )}
                        {mentoria.diagnostico.numero_funcionarios && (
                          <p><span className="font-medium">Funcionários:</span> {mentoria.diagnostico.numero_funcionarios}</p>
                        )}
                        {mentoria.diagnostico.desafios_principais && (
                          <p className="md:col-span-2"><span className="font-medium">Desafios:</span> {mentoria.diagnostico.desafios_principais}</p>
                        )}
                      </div>
                      {mentoria.diagnostico.observacoes && (
                        <p className="text-xs mt-2"><span className="font-medium">Observações:</span> {mentoria.diagnostico.observacoes}</p>
                      )}
                    </div>
                  )}

                  {/* Checkout */}
                  {mentoria.checkout && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-700 mb-2">Avaliação:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        {mentoria.checkout.nps && (
                          <p><span className="font-medium">NPS:</span> {mentoria.checkout.nps}/10</p>
                        )}
                        {mentoria.checkout.proximos_passos && (
                          <p><span className="font-medium">Próximos passos:</span> {mentoria.checkout.proximos_passos}</p>
                        )}
                        {mentoria.checkout.observacoes && (
                          <p className="md:col-span-2"><span className="font-medium">Observações:</span> {mentoria.checkout.observacoes}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] lg:max-w-7xl xl:max-w-[90vw] p-0 bg-white">
        <DialogHeader className="p-4 pb-3 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-stone-600/20 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={faUser} 
                  className="h-4 w-4 text-stone-700" 
                />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900 truncate max-w-[300px] sm:max-w-[500px]">
                  {mentorName || 'Detalhes do Mentor'}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Histórico Completo
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-3 overflow-hidden min-h-0">
          {isLoading ? (
            <div className="w-full flex items-center justify-center h-[calc(85vh-120px)]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando detalhes do mentor...</p>
              </div>
            </div>
          ) : error ? (
            <div className="w-full flex items-center justify-center h-[calc(85vh-120px)]">
              <div className="text-center">
                <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={loadMentorDetails} variant="outline">
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : mentorDetails ? (
            <div className="w-full h-[calc(85vh-120px)]">
              {renderMentorDetails()}
            </div>
          ) : (
            <div className="w-full flex items-center justify-center h-[calc(85vh-120px)]">
              <div className="text-center">
                <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Detalhes não disponíveis</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
