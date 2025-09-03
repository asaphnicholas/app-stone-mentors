"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { NewBusinessCard } from "@/components/ui/new-business-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faComments, 
  faClock, 
  faStar, 
  faTrendingUp, 
  faCalendar, 
  faMapMarkerAlt,
  faUserTie,
  faPhone,
  faEnvelope,
  faBuilding,
  faLocationDot,
  faClock as faClockRegular,
  faCheckCircle,
  faExclamationTriangle,
  faArrowRight,
  faPlus
} from "@fortawesome/free-solid-svg-icons"
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons"

// Mock data
const mentorMetrics = [
  {
    title: "Mentorias Ativas",
    value: "3",
    icon: faComments,
    trend: { value: "+1", period: "esta semana", direction: "up" as const },
    color: "green" as const,
    description: "Sessões em andamento"
  },
  {
    title: "Próxima Agendada",
    value: "Hoje 15h",
    icon: faClock,
    color: "blue" as const,
    description: "Tech Startup - João Silva"
  },
  {
    title: "NPS Médio",
    value: "9.2",
    icon: faStar,
    trend: { value: "+0.3", period: "último mês", direction: "up" as const },
    color: "yellow" as const,
    description: "Satisfação dos mentorados"
  },
  {
    title: "Tempo Médio",
    value: "45min",
    icon: faTrendingUp,
    trend: { value: "-5min", period: "último mês", direction: "down" as const },
    color: "purple" as const,
    description: "Por sessão"
  },
]

const newBusiness = {
  nome: "Padaria do Bairro",
  contato: "Maria Santos",
  telefone: "(11) 99999-9999",
  email: "maria@padaria.com",
  segmento: "Alimentação",
  localizacao: "Centro, São Paulo",
  tempoFila: "3 dias",
  prioridade: "Alta"
}

const upcomingMentorings = [
  {
    id: 1,
    business: "Tech Startup",
    contact: "João Silva",
    date: "Hoje",
    time: "15:00",
    type: "Follow-up",
    location: "Presencial - Escritório",
    status: "confirmado",
    priority: "Alta"
  },
  {
    id: 2,
    business: "Loja de Roupas",
    contact: "Ana Costa",
    date: "Amanhã",
    time: "10:00",
    type: "Diagnóstico",
    location: "Online - Zoom",
    status: "pendente",
    priority: "Média"
  },
  {
    id: 3,
    business: "Restaurante Familiar",
    contact: "Carlos Oliveira",
    date: "Sexta-feira",
    time: "14:30",
    type: "Follow-up",
    location: "Presencial - Local do cliente",
    status: "confirmado",
    priority: "Baixa"
  },
]

export default function MentorDashboard() {
  const handleNewBusinessAction = (action: string) => {
    console.log("Ação:", action)
    // TODO: Implement action logic
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200'
      case 'Média': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Baixa': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    return status === "confirmado" ? faCheckCircle : faExclamationTriangle
  }

  const getStatusColor = (status: string) => {
    return status === "confirmado" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-yellow-100 text-yellow-700 border-yellow-200"
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Novo Negócio Atribuído!</h2>
            <p className="text-white/90">Você tem 1 novo negócio aguardando atendimento</p>
          </div>
          <Button 
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => console.log("Ver detalhes do novo negócio")}
          >
            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
            Ver Detalhes
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mentorMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  metric.color === 'green' ? 'bg-green-100 text-green-600' :
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  metric.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <FontAwesomeIcon icon={metric.icon} className="h-6 w-6" />
                </div>
                {metric.trend && (
                  <Badge className={`${
                    metric.trend.direction === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  } border-0`}>
                    {metric.trend.value}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* New Business Card */}
        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-stone-green-dark" />
                Novo Negócio Atribuído
              </CardTitle>
              <Badge className="bg-red-100 text-red-700 border-red-200">
                {newBusiness.prioridade}
              </Badge>
            </div>
            <CardDescription>Negócio aguardando seu primeiro contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-semibold text-gray-900">{newBusiness.nome}</p>
                  <p className="text-sm text-gray-600">{newBusiness.segmento}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{newBusiness.contato}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{newBusiness.telefone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{newBusiness.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FontAwesomeIcon icon={faLocationDot} className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{newBusiness.localizacao}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-stone-green-dark hover:bg-stone-green-light text-white">
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2" />
                Entrar em Contato
              </Button>
              <Button variant="outline" className="flex-1">
                <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 mr-2" />
                Já Agendei
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Mentorings */}
        <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-stone-green-dark" />
              Próximas Mentorias
            </CardTitle>
            <CardDescription>Suas mentorias agendadas para os próximos dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMentorings.map((mentoring) => (
                <div
                  key={mentoring.id}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">{mentoring.business}</p>
                        <Badge variant="outline" className="text-xs">
                          {mentoring.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUserTie} className="h-3 w-3" />
                        {mentoring.contact}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-xs border ${getStatusColor(mentoring.status)}`}>
                        <FontAwesomeIcon icon={getStatusIcon(mentoring.status)} className="h-3 w-3 mr-1" />
                        {mentoring.status === "confirmado" ? "Confirmado" : "Pendente"}
                      </Badge>
                      <Badge className={`text-xs border ${getPriorityColor(mentoring.priority)}`}>
                        {mentoring.priority}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faClockRegular} className="h-3 w-3" />
                      <span>{mentoring.date} às {mentoring.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3" />
                      <span className="truncate">{mentoring.location}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <Button variant="ghost" size="sm" className="w-full text-stone-green-dark hover:text-stone-green-light hover:bg-stone-green-dark/5">
                      <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                Agendar Nova Mentoria
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
