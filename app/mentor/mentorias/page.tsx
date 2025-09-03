"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  faArrowRight
} from "@fortawesome/free-solid-svg-icons"

// Mock data for mentor's businesses
const activeMentorings = [
  {
    id: 1,
    nome: "Padaria do Bairro",
    contato: "Maria Santos",
    telefone: "(11) 99999-9999",
    segmento: "Alimentação",
    localizacao: "Centro, São Paulo",
    progresso: 40,
    proximaSessao: "Hoje às 15:00",
    sessoesConcluidas: 2,
    totalSessoes: 5,
    status: "agendado",
    tipo: "Follow-up",
    prioridade: "Alta"
  },
  {
    id: 2,
    nome: "Tech Startup",
    contato: "João Silva",
    telefone: "(11) 88888-8888",
    segmento: "Tecnologia",
    localizacao: "Vila Madalena, São Paulo",
    progresso: 75,
    proximaSessao: "Amanhã às 10:00",
    sessoesConcluidas: 3,
    totalSessoes: 4,
    status: "confirmado",
    tipo: "Diagnóstico",
    prioridade: "Média"
  },
  {
    id: 3,
    nome: "Loja de Roupas Fashion",
    contato: "Ana Costa",
    telefone: "(11) 77777-7777",
    segmento: "Moda",
    localizacao: "Jardins, São Paulo",
    progresso: 20,
    proximaSessao: "Pendente agendamento",
    sessoesConcluidas: 1,
    totalSessoes: 5,
    status: "pendente",
    tipo: "Primeira Mentoria",
    prioridade: "Baixa"
  },
]

const completedMentorings = [
  {
    id: 4,
    nome: "Restaurante Familiar",
    contato: "Carlos Oliveira",
    segmento: "Alimentação",
    dataFinalizacao: "15/01/2024",
    sessoesConcluidas: 5,
    npsRecebido: 9,
    feedback: "Excelente mentoria! Consegui organizar melhor as finanças do restaurante.",
  },
  {
    id: 5,
    nome: "Academia Fitness",
    contato: "Fernanda Lima",
    segmento: "Saúde",
    dataFinalizacao: "08/01/2024",
    sessoesConcluidas: 4,
    npsRecebido: 10,
    feedback: "O mentor me ajudou muito com estratégias de marketing digital.",
  },
]

export default function MentoriasPage() {
  const [activeTab, setActiveTab] = useState("ativas")

  const handleScheduleSession = (businessId: number) => {
    console.log(`Agendando sessão para negócio ${businessId}`)
    // TODO: Implement scheduling logic
  }

  const handleContact = (phone: string) => {
    console.log(`Entrando em contato: ${phone}`)
    // TODO: Implement contact logic
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-700 border-green-200'
      case 'agendado': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
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
    switch (status) {
      case 'confirmado': return faCheckCircle
      case 'agendado': return faCalendarAlt
      case 'pendente': return faExclamationTriangle
      default: return faClock
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-stone-green-dark/10 rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-stone-green-dark" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Minhas Mentorias</h1>
            <p className="text-gray-600">Gerencie seus negócios atribuídos e acompanhe o progresso</p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-900">{activeMentorings.length}</p>
                <p className="text-sm text-blue-700">Mentorias Ativas</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faGraduationCap} className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-900">{completedMentorings.length}</p>
                <p className="text-sm text-green-700">Finalizadas</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-900">9.5</p>
                <p className="text-sm text-purple-700">NPS Médio</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white p-1 rounded-xl shadow-sm">
          <TabsTrigger value="ativas" className="rounded-lg data-[state=active]:bg-stone-green-dark data-[state=active]:text-white">
            Mentorias Ativas ({activeMentorings.length})
          </TabsTrigger>
          <TabsTrigger value="finalizadas" className="rounded-lg data-[state=active]:bg-stone-green-dark data-[state=active]:text-white">
            Finalizadas ({completedMentorings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeMentorings.map((business) => (
              <Card key={business.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-stone-green-dark" />
                      {business.nome}
                    </CardTitle>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-xs border ${getStatusColor(business.status)}`}>
                        <FontAwesomeIcon icon={getStatusIcon(business.status)} className="h-3 w-3 mr-1" />
                        {business.status === "confirmado" ? "Confirmado" : 
                         business.status === "agendado" ? "Agendado" : "Pendente"}
                      </Badge>
                      <Badge className={`text-xs border ${getPriorityColor(business.prioridade)}`}>
                        {business.prioridade}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {business.segmento}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {business.tipo}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Contact Info */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{business.contato}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faPhone} className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{business.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{business.localizacao}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">Progresso da Mentoria:</span>
                      <span className="font-bold text-stone-green-dark">{business.progresso}%</span>
                    </div>
                    <Progress value={business.progresso} className="h-3 bg-gray-200" />
                    <div className="text-xs text-gray-500 text-center">
                      {business.sessoesConcluidas} de {business.totalSessoes} sessões concluídas
                    </div>
                  </div>

                  {/* Next Session */}
                  <div className={`p-4 rounded-xl border ${
                    business.status === "pendente" 
                      ? "bg-yellow-50 border-yellow-200" 
                      : "bg-blue-50 border-blue-200"
                  }`}>
                    <div className="flex items-center gap-3">
                      <FontAwesomeIcon 
                        icon={business.status === "pendente" ? faExclamationTriangle : faClock} 
                        className={`h-5 w-5 ${
                          business.status === "pendente" ? "text-yellow-600" : "text-blue-600"
                        }`} 
                      />
                      <div>
                        <p className={`font-medium text-sm ${
                          business.status === "pendente" ? "text-yellow-800" : "text-blue-800"
                        }`}>
                          Próxima sessão
                        </p>
                        <p className={`text-sm ${
                          business.status === "pendente" ? "text-yellow-700" : "text-blue-700"
                        }`}>
                          {business.proximaSessao}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleContact(business.telefone)}
                      variant="outline"
                      className="flex-1"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faPhoneVolume} className="h-4 w-4 mr-2" />
                      Contatar
                    </Button>
                    <Button
                      onClick={() => handleScheduleSession(business.id)}
                      className="flex-1 bg-stone-green-dark hover:bg-stone-green-light"
                      size="sm"
                    >
                      <FontAwesomeIcon icon={faCalendarPlus} className="h-4 w-4 mr-2" />
                      {business.status === "pendente" ? "Agendar" : "Reagendar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="finalizadas" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedMentorings.map((business) => (
              <Card key={business.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-200 bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-600" />
                      {business.nome}
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700 border-green-200">Finalizada</Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {business.segmento}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">{business.contato}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">Finalizada em {business.dataFinalizacao}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FontAwesomeIcon icon={faGraduationCap} className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{business.sessoesConcluidas} sessões concluídas</span>
                    </div>
                  </div>

                  {/* NPS Score */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-yellow-800">NPS Recebido:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < business.npsRecebido ? "bg-yellow-500" : "bg-gray-200"
                            }`}
                          />
                        ))}
                        <span className="ml-3 font-bold text-yellow-700">{business.npsRecebido}/10</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-700">{business.npsRecebido}</p>
                      <p className="text-xs text-yellow-600">Pontuação máxima</p>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="bg-stone-green-dark/5 border border-stone-green-dark/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={faStar} className="h-4 w-4 text-stone-green-dark" />
                      <span className="text-sm font-medium text-stone-green-dark">Feedback do Mentorado</span>
                    </div>
                    <p className="text-sm italic text-gray-700">"{business.feedback}"</p>
                  </div>

                  <Button variant="outline" className="w-full">
                    <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 mr-2" />
                    Ver Relatório Completo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
