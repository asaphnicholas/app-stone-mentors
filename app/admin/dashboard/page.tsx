"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUsers, 
  faBuilding, 
  faComments, 
  faChartLine, 
  faPlus, 
  faUserPlus, 
  faFileText,
  faTachometerAlt
} from "@fortawesome/free-solid-svg-icons"
import { cn } from "@/lib/utils"

// Mock data
const metrics = [
  {
    title: "Mentores Cadastrados",
    value: "12",
    icon: <FontAwesomeIcon icon={faUsers} className="h-5 w-5" />,
    trend: { value: "+2", period: "esta semana", direction: "up" as const },
    color: "verde-claro" as const,
  },
  {
    title: "Negócios na Fila",
    value: "8",
    icon: <FontAwesomeIcon icon={faBuilding} className="h-5 w-5" />,
    trend: { value: "+3", period: "hoje", direction: "up" as const },
    color: "yellow" as const,
  },
  {
    title: "Mentorias Ativas",
    value: "24",
    icon: <FontAwesomeIcon icon={faComments} className="h-5 w-5" />,
    trend: { value: "+5", period: "esta semana", direction: "up" as const },
    color: "blue" as const,
  },
  {
    title: "Taxa de Sucesso",
    value: "94%",
    icon: <FontAwesomeIcon icon={faChartLine} className="h-5 w-5" />,
    trend: { value: "+2%", period: "último mês", direction: "up" as const },
    color: "verde-escuro" as const,
  },
]

const quickActions = [
  {
    title: "Convidar Mentor",
    description: "Adicionar novo mentor à plataforma",
    icon: <FontAwesomeIcon icon={faUserPlus} className="h-6 w-6" />,
    color: "bg-stone-green-light",
  },
  {
    title: "Cadastrar Negócio",
    description: "Adicionar novo negócio à fila",
    icon: <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    title: "Gerar Relatório",
    description: "Criar relatório de performance",
    icon: <FontAwesomeIcon icon={faFileText} className="h-6 w-6" />,
    color: "bg-purple-500",
  },
]

const recentActivities = [
  {
    id: 1,
    mentor: "João Silva",
    action: "finalizou mentoria com",
    business: "Padaria do Bairro",
    time: "há 5 minutos",
    avatar: "JS",
    type: "success",
  },
  {
    id: 2,
    mentor: "Maria Santos",
    action: "agendou mentoria com",
    business: "Tech Startup",
    time: "há 15 minutos",
    avatar: "MS",
    type: "info",
  },
  {
    id: 3,
    mentor: "Carlos Oliveira",
    action: "enviou diagnóstico para",
    business: "Loja de Roupas",
    time: "há 1 hora",
    avatar: "CO",
    type: "info",
  },
  {
    id: 4,
    mentor: "Ana Costa",
    action: "se cadastrou na plataforma",
    business: "",
    time: "há 2 horas",
    avatar: "AC",
    type: "success",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faTachometerAlt} className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Bem-vindo ao Painel Admin</h1>
            <p className="text-white/90 text-lg">Gerencie mentores, negócios e acompanhe o desempenho da plataforma</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Ações Rápidas</CardTitle>
            <CardDescription className="text-gray-600">Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <Button 
                key={index} 
                variant="ghost" 
                className="w-full justify-start h-auto p-4 hover:bg-gray-50/80 rounded-xl transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl ${action.color} text-white mr-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  {action.icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 group-hover:text-stone-green-dark transition-colors">
                    {action.title}
                  </p>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Atividades Recentes</CardTitle>
            <CardDescription className="text-gray-600">Últimas ações dos mentores na plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors duration-200">
                  <Avatar className="h-10 w-10 ring-2 ring-stone-green-light/20">
                    <AvatarFallback className="bg-stone-green-light text-white text-sm font-semibold">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold text-stone-green-dark">{activity.mentor}</span>{" "}
                      <span className="text-gray-600">{activity.action}</span>{" "}
                      {activity.business && <span className="font-semibold text-gray-900">{activity.business}</span>}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <Badge
                    variant={activity.type === "success" ? "default" : "secondary"}
                    className={cn(
                      "px-3 py-1 text-xs font-medium",
                      activity.type === "success" 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    )}
                  >
                    {activity.type === "success" ? "✅ Concluído" : "🔄 Em andamento"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
