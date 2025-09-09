"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUsers, 
  faUserCheck, 
  faHandshake, 
  faGraduationCap, 
  faChartLine,
  faTachometerAlt,
  faBookOpen,
  faCheckCircle,
  faPlay,
  faClock, 
  faBuilding,
  faUser,
  faCalendarAlt,
  faArrowRight,
  faAward,
  faTrophy,
  faRocket
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { mentorDashboardService, type MentorDashboard } from "@/lib/services/mentor-dashboard"
import Link from "next/link"

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
    <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faHandshake} className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Dashboard do Mentor</h1>
          <p className="text-white/90 text-xl">Carregando seus dados...</p>
          <p className="text-white/80 text-base">Aguarde um momento</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="h-32 bg-gradient-to-br from-gray-200 to-gray-300 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-3 bg-white/60 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-white/80 rounded w-1/2"></div>
                </div>
                <div className="w-12 h-12 bg-white/40 rounded-xl"></div>
              </div>
            </div>
            <div className="p-6">
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="animate-pulse border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </CardContent>
    </Card>
  </div>
)

export default function MentorDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [dashboardData, setDashboardData] = useState<MentorDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated) {
      loadDashboardData()
    }
  }, [isHydrated])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      const data = await mentorDashboardService.getDashboard()
      setDashboardData(data)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar dados",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
  }

  if (!dashboardData) {
    return <div>Erro ao carregar dados do dashboard</div>
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
              <FontAwesomeIcon icon={faHandshake} className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Olá, {user?.nome || 'Mentor'}!
              </h1>
              <p className="text-white/90 text-xl">Acompanhe suas mentorias e desenvolvimento</p>
              <p className="text-white/80 text-base">Transforme negócios através da sua experiência</p>
            </div>
          </div>
          
          {dashboardData.status_qualificacao.is_qualified && (
            <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl shadow-lg">
              <FontAwesomeIcon icon={faTrophy} className="h-6 w-6" />
              <div>
                <span className="font-bold text-lg block">{dashboardData.status_qualificacao.status_text}</span>
                <span className="text-white/90 text-sm">Pronto para mentorar</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total de Mentorias */}
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-stone-green-light to-stone-green-dark p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 -translate-x-6"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white/90 mb-2">Negócios Conectados</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    {dashboardData.mentorias_realizadas.total_mentorias}
                  </div>
                </div>
                
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faHandshake} className="h-7 w-7 text-white" />
              </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Total de negócios que você já mentorou com sucesso
              </p>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-green-light/10 text-stone-green-dark">
                  <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                  {dashboardData.mentorias_realizadas.concluidas} concluídas
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  Tempo médio: {dashboardData.mentorias_realizadas.tempo_medio_meses} meses
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdos Concluídos */}
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-stone-green-light to-stone-green-dark p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 -translate-x-6"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white/90 mb-2">Conteúdos Concluídos</h3>
                  <div className="text-3xl font-bold text-white mb-1">
                    {dashboardData.conteudos_concluidos.concluidos}/{dashboardData.conteudos_concluidos.total_materiais}
                  </div>
                </div>
                
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faGraduationCap} className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Seu progresso na trilha de conhecimento
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progresso</span>
                  <span className="font-semibold text-stone-green-dark">
                    {dashboardData.conteudos_concluidos.progresso_percentual}%
                  </span>
                </div>
                <Progress 
                  value={dashboardData.conteudos_concluidos.progresso_percentual} 
                  className="h-2"
                />
                <p className="text-xs text-gray-500">
                  Último: {dashboardData.conteudos_concluidos.ultimo_material}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status de Qualificação */}
        <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-stone-green-light to-stone-green-dark p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 -translate-x-6"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white/90 mb-2">Status de Qualificação</h3>
                  <div className="text-2xl font-bold text-white mb-1">
                    {dashboardData.status_qualificacao.status_text}
                  </div>
                </div>
                
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon icon={faAward} className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-white">
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {dashboardData.status_qualificacao.is_qualified 
                  ? 'Você está apto para mentorar negócios'
                  : 'Continue estudando para se qualificar'
                }
              </p>
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                  dashboardData.status_qualificacao.is_active 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  <FontAwesomeIcon 
                    icon={dashboardData.status_qualificacao.is_active ? faCheckCircle : faClock} 
                    className="h-3 w-3 mr-2" 
                  />
                  {dashboardData.status_qualificacao.is_active ? 'Ativo' : 'Pendente'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentoria Ativa */}
      {dashboardData.mentoria_ativa && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faRocket} className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Mentoria Ativa</CardTitle>
                <CardDescription className="text-gray-600">Acompanhe o progresso da sua mentoria atual</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações do Negócio */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{dashboardData.mentoria_ativa.negocio_nome}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-stone-green-dark" />
                      <div>
                        <p className="text-sm text-gray-600">Empreendedor</p>
                        <p className="font-semibold text-gray-900">{dashboardData.mentoria_ativa.empreendedor_nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-stone-green-dark" />
                      <div>
                        <p className="text-sm text-gray-600">Início da Mentoria</p>
                        <p className="font-semibold text-gray-900">{formatDate(dashboardData.mentoria_ativa.data_inicio)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-stone-green-dark" />
                      <div>
                        <p className="text-sm text-gray-600">Próxima Sessão</p>
                        <p className="font-semibold text-gray-900">{formatDateTime(dashboardData.mentoria_ativa.proxima_sessao)}</p>
                    </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Badge className="bg-stone-green-light/10 text-stone-green-dark border-0 text-sm py-1 px-3">
                    <FontAwesomeIcon icon={faPlay} className="h-3 w-3 mr-2" />
                    {dashboardData.mentoria_ativa.status}
                  </Badge>
                </div>
              </div>

              {/* Ações */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <Link href={`/mentor/mentorias/${dashboardData.mentoria_ativa.negocio_id}`}>
                    <Button className="w-full bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-12">
                      <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                      Acessar Mentoria
                    </Button>
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white">
                      Agendar Sessão
                    </Button>
                    <Button variant="outline" className="border-stone-green-dark text-stone-green-dark hover:bg-stone-green-dark hover:text-white">
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
            </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-600">Acesso rápido às principais funcionalidades</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/mentor/trilha-conhecimento">
              <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-stone-green-light to-stone-green-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faBookOpen} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-stone-green-dark transition-colors text-lg mb-2">
                        Trilha de Conhecimento
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Continue seus estudos e desenvolvimento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/mentor/mentorias">
              <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-stone-green-light to-stone-green-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-stone-green-dark transition-colors text-lg mb-2">
                        Minhas Mentorias
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Gerencie todas as suas mentorias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* <Link href="/perfil">
              <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-stone-green-light to-stone-green-dark text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-stone-green-dark transition-colors text-lg mb-2">
                        Meu Perfil
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">Atualize suas informações e preferências</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link> */}
      </div>
        </CardContent>
      </Card>
    </div>
  )
}