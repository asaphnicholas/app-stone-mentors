"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUsers, 
  faUserCheck, 
  faUserClock, 
  faFileText, 
  faPlus, 
  faUserPlus, 
  faBuilding,
  faTachometerAlt,
  faExclamationTriangle,
  faCheckCircle,
  faGraduationCap,
  faChartLine
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { usersService, type DashboardOverview } from "@/lib/services/users"
import Link from "next/link"

// Hook para detectar hidratação
function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}

// Componente de card melhorado
interface EnhancedMetricCardProps {
  title: string
  value: string | number
  icon: any
  description?: string
  trend?: {
    value: string
    period: string
    direction: "up" | "down" | "neutral"
  }
  color: "blue" | "green" | "yellow" | "purple" | "red" | "indigo"
  className?: string
}

const colorVariants = {
  blue: {
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "border-blue-200",
    lightBg: "bg-blue-50/50"
  },
  green: {
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600", 
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "border-emerald-200",
    lightBg: "bg-emerald-50/50"
  },
  yellow: {
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    iconBg: "bg-amber-100", 
    iconColor: "text-amber-600",
    accent: "border-amber-200",
    lightBg: "bg-amber-50/50"
  },
  purple: {
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600", 
    accent: "border-purple-200",
    lightBg: "bg-purple-50/50"
  },
  red: {
    gradient: "bg-gradient-to-br from-red-500 to-red-600",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    accent: "border-red-200", 
    lightBg: "bg-red-50/50"
  },
  indigo: {
    gradient: "bg-gradient-to-br from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    accent: "border-indigo-200",
    lightBg: "bg-indigo-50/50"
  }
}

function EnhancedMetricCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  color,
  className = "" 
}: EnhancedMetricCardProps) {
  const colors = colorVariants[color]

  return (
    <Card className={`group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {/* Header com gradiente */}
        <div className={`${colors.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 -translate-x-6"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/90 mb-2">{title}</h3>
              <div className="text-3xl font-bold text-white mb-1">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
            </div>
            
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              {icon}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="p-6 bg-white">
          {description && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>
          )}
          
          {trend && (
            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${colors.lightBg} ${colors.iconColor}`}>
                <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                {trend.value}
              </div>
              <span className="text-xs text-gray-500 font-medium">{trend.period}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const quickActions = [
  {
    title: "Gerenciar Mentores",
    description: "Aprovar e gerenciar mentores pendentes",
    icon: <FontAwesomeIcon icon={faUsers} className="h-6 w-6" />,
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    href: "/admin/mentores",
  },
  {
    title: "Criar Material",
    description: "Adicionar novo material de treinamento",
    icon: <FontAwesomeIcon icon={faFileText} className="h-6 w-6" />,
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    href: "/admin/conteudos",
  },
  {
    title: "Cadastrar Negócio",
    description: "Adicionar novo negócio à fila",
    icon: <FontAwesomeIcon icon={faBuilding} className="h-6 w-6" />,
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    href: "/admin/negocios",
  },
]

// Componente de Loading
const LoadingState = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-6 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faTachometerAlt} className="h-8 w-8 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Carregando Dashboard...</h1>
          <p className="text-white/90 text-lg">Aguarde um momento</p>
          <p className="text-white/80 text-sm mt-1">Buscando dados mais recentes</p>
        </div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
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
  </div>
)

export default function AdminDashboard() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null)
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
      const data = await usersService.getDashboardOverview()
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

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
  }

  const metrics = dashboardData ? [
    {
      title: "Total de Materiais",
      value: dashboardData.materials.total_materials,
      icon: <FontAwesomeIcon icon={faFileText} className="h-7 w-7 text-white" />,
      description: "Materiais de treinamento disponíveis na plataforma",
      trend: { 
        value: `${dashboardData.materials.materials_obrigatorios} obrigatórios`, 
        period: "para qualificação", 
        direction: "up" as const 
      },
      color: "green" as const,
    },
    {
      title: "Mentores Ativos",
      value: dashboardData.users.mentores_ativos,
      icon: <FontAwesomeIcon icon={faUserCheck} className="h-7 w-7 text-white" />,
      description: "Mentores qualificados e ativos no sistema",
      trend: { 
        value: `${dashboardData.users.mentores_qualificados} qualificados`, 
        period: "prontos para mentorar", 
        direction: "up" as const 
      },
      color: "green" as const,
    },
    {
      title: "Pendentes",
      value: dashboardData.users.mentores_pendentes,
      icon: <FontAwesomeIcon icon={faUserClock} className="h-7 w-7 text-white" />,
      description: "Mentores aguardando aprovação administrativa",
      trend: { 
        value: "aguardando", 
        period: "revisão e aprovação", 
        direction: "neutral" as const 
      },
      color: "green" as const,
    },
    {
      title: "Total de Usuários",
      value: dashboardData.users.total_usuarios,
      icon: <FontAwesomeIcon icon={faUsers} className="h-7 w-7 text-white" />,
      description: "Usuários cadastrados na plataforma completa",
      trend: { 
        value: "registrados", 
        period: "em toda plataforma", 
        direction: "up" as const 
      },
      color: "green" as const,
    },
  ] : []

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faTachometerAlt} className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo, {user?.nome || 'Administrador'}!
            </h1>
            <p className="text-white/90 text-xl mb-1">{user?.email}</p>
            <p className="text-white/80 text-base">Gerencie mentores, negócios e acompanhe o desempenho da plataforma</p>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <EnhancedMetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            description={metric.description}
            trend={metric.trend}
            color={metric.color}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Ações Rápidas</CardTitle>
              <CardDescription className="text-gray-600">Acesso rápido às principais funcionalidades administrativas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-0 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-xl ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        {action.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-stone-green-dark transition-colors text-lg mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {dashboardData?.alerts.needs_attention && (
        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-800 mb-2">Atenção Necessária</h3>
                <p className="text-amber-700 text-lg mb-4">
                  Você tem <span className="font-bold">{dashboardData.alerts.pending_approvals}</span> mentores aguardando aprovação.
                </p>
                <Link href="/admin/mentores">
                  <Button className="bg-gradient-to-br from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg">
                    <FontAwesomeIcon icon={faUsers} className="h-4 w-4 mr-2" />
                    Gerenciar Mentores
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}