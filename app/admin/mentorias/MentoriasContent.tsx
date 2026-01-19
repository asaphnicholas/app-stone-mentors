"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHandshake,
  faCheckCircle,
  faStar,
  faBuilding,
  faSearch,
  faFilter,
  faFileExport,
  faEye,
  faClock,
  faUser,
  faCalendar,
  faChartLine,
  faClipboardList,
  faChevronDown,
  faDownload,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons"
import adminMentoriasService, { 
  type MentoriaStats,
  type Mentoria,
  type MentoriaDetalhes
} from "@/lib/services/admin-mentorias"
import diagnosticosService, {
  type Diagnostico,
  type ListDiagnosticosParams
} from "@/lib/services/diagnosticos"

// Types já importados do serviço

// Component de card de métrica melhorado
interface MetricCardProps {
  title: string
  value: string | number
  icon: any
  description?: string
  color: "blue" | "green" | "yellow" | "purple"
}

const colorVariants = {
  blue: {
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  green: {
    gradient: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  yellow: {
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  purple: {
    gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
}

function MetricCard({ title, value, icon, description, color }: MetricCardProps) {
  const colors = colorVariants[color]

  return (
    <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-lg overflow-hidden">
      <CardContent className="p-0">
        <div className={`${colors.gradient} p-6 text-white relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5 -translate-y-10 -translate-x-6"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white/90 mb-2">{title}</h3>
              <div className="text-3xl font-bold text-white mb-1">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </div>
            </div>

            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              {icon}
            </div>
          </div>
        </div>

        {description && (
          <div className="p-6 bg-white">
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Loading State Component
const LoadingState = () => (
  <div className="space-y-6">
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
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function MentoriasContent() {
  const { user } = useAuth()
  const { addToast } = useToast()

  // Estados
  const [activeTab, setActiveTab] = useState<string>("mentorias")
  const [stats, setStats] = useState<MentoriaStats | null>(null)
  const [mentorias, setMentorias] = useState<Mentoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [dataInicioFilter, setDataInicioFilter] = useState<string>("")
  const [dataFimFilter, setDataFimFilter] = useState<string>("")

  // Estados para Diagnósticos
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [isLoadingDiagnosticos, setIsLoadingDiagnosticos] = useState(false)
  const [totalDiagnosticos, setTotalDiagnosticos] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  // Modal de detalhes
  const [selectedMentoria, setSelectedMentoria] = useState<MentoriaDetalhes | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [selectedDiagnostico, setSelectedDiagnostico] = useState<Diagnostico | null>(null)
  const [isDiagnosticoModalOpen, setIsDiagnosticoModalOpen] = useState(false)

  // Debounce para searchTerm (aguarda 500ms após parar de digitar)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Carregar dados iniciais e quando filtros mudarem
  useEffect(() => {
    loadMentorias()
    
    // Stats só precisam ser recarregadas quando as datas mudarem
    // (não precisam ser recarregadas para cada mudança de filtro)
  }, [statusFilter, tipoFilter, dataInicioFilter, dataFimFilter, debouncedSearchTerm])

  // Carregar estatísticas apenas quando filtros de data mudarem
  useEffect(() => {
    loadStats()
  }, [dataInicioFilter, dataFimFilter])

  // Carregar diagnósticos quando a tab for ativada ou filtros mudarem
  useEffect(() => {
    if (activeTab === 'diagnosticos') {
      loadDiagnosticos()
    }
  }, [activeTab, dataInicioFilter, dataFimFilter])

  const loadStats = async () => {
    try {
      const params = {
        data_inicio: dataInicioFilter || undefined,
        data_fim: dataFimFilter || undefined,
      }

      const result = await adminMentoriasService.getMentoriaStats(params)
      setStats(result)
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar estatísticas",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const loadMentorias = async () => {
    try {
      setIsLoading(true)

      const params = {
        status: statusFilter !== "todos" ? statusFilter : undefined,
        tipo: tipoFilter !== "todos" ? tipoFilter : undefined,
        data_inicio: dataInicioFilter || undefined,
        data_fim: dataFimFilter || undefined,
        limit: 0, // 0 = sem limite, retorna todas (backend limita a 1000)
        search: debouncedSearchTerm || undefined,
      }

      console.log('Carregando mentorias - Filtros:', params)

      const result = await adminMentoriasService.listMentorias(params)
      
      setMentorias(result.mentorias)

      console.log('✅ Mentorias carregadas:', {
        quantidade: result.mentorias.length,
        total: result.total,
        filtrosAplicados: result.filtros_aplicados
      })
    } catch (error) {
      console.error('Erro ao carregar mentorias:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar mentorias",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
      
      // Em caso de erro, limpar a lista
      setMentorias([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadDiagnosticos = async () => {
    try {
      setIsLoadingDiagnosticos(true)

      const params: ListDiagnosticosParams = {
        data_inicio: dataInicioFilter || undefined,
        data_fim: dataFimFilter || undefined,
        limit: 50, // Limitar a 50 por vez
      }

      console.log('Carregando diagnósticos - Filtros:', params)

      const result = await diagnosticosService.listDiagnosticos(params)
      
      setDiagnosticos(result.diagnosticos)
      setTotalDiagnosticos(result.total)

      console.log('✅ Diagnósticos carregados:', {
        quantidade: result.diagnosticos.length,
        total: result.total
      })
    } catch (error) {
      console.error('Erro ao carregar diagnósticos:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar diagnósticos",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
      
      setDiagnosticos([])
    } finally {
      setIsLoadingDiagnosticos(false)
    }
  }

  const handleExportDiagnosticos = async () => {
    try {
      setIsExporting(true)

      const params: ListDiagnosticosParams = {
        data_inicio: dataInicioFilter || undefined,
        data_fim: dataFimFilter || undefined,
      }

      const blob = await diagnosticosService.exportDiagnosticos(params)
      diagnosticosService.downloadCSV(blob)

      addToast({
        type: "success",
        title: "Exportação concluída",
        message: "Diagnósticos exportados com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao exportar diagnósticos:', error)
      addToast({
        type: "error",
        title: "Erro ao exportar diagnósticos",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleViewDiagnostico = (diagnostico: Diagnostico) => {
    setSelectedDiagnostico(diagnostico)
    setIsDiagnosticoModalOpen(true)
  }

  const loadMentoriaDetails = async (mentoriaId: string) => {
    try {
      setIsLoadingDetails(true)

      const result = await adminMentoriasService.getMentoriaDetails(mentoriaId)
      
      setSelectedMentoria(result)
      setIsDetailsModalOpen(true)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar detalhes",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      addToast({
        type: "info",
        title: "Exportando relatório",
        message: "O download do arquivo CSV será iniciado em breve...",
      })

      const params = {
        periodo_inicio: dataInicioFilter || undefined,
        periodo_fim: dataFimFilter || undefined,
        status: statusFilter !== "todos" ? statusFilter : undefined,
        tipo: tipoFilter !== "todos" ? tipoFilter : undefined,
      }

      const blob = await adminMentoriasService.exportMentoriasCSV(params)
      
      // Gerar nome do arquivo com data atual
      const dataAtual = new Date().toISOString().split('T')[0]
      const filename = `mentorias_${dataAtual}.csv`
      
      adminMentoriasService.downloadCSV(blob, filename)
      
      addToast({
        type: "success",
        title: "Relatório exportado",
        message: "O arquivo CSV foi baixado com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao exportar:', error)
      addToast({
        type: "error",
        title: "Erro ao exportar",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string }> = {
      DISPONIVEL: { label: "Disponível", color: "bg-gray-100 text-gray-800 border-gray-200" },
      AGENDADA: { label: "Agendada", color: "bg-purple-100 text-purple-800 border-purple-200" },
      CONFIRMADA: { label: "Confirmada", color: "bg-blue-100 text-blue-800 border-blue-200" },
      EM_ANDAMENTO: { label: "Em Andamento", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      FINALIZADA: { label: "Finalizada", color: "bg-green-100 text-green-800 border-green-200" },
      CANCELADA: { label: "Cancelada", color: "bg-red-100 text-red-800 border-red-200" },
    }

    const config = statusConfig[status] || statusConfig.DISPONIVEL
    return (
      <Badge className={`${config.color} border`}>
        {config.label}
      </Badge>
    )
  }

  const getTipoBadge = (tipo: string) => {
    return tipo === "primeira" ? (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        Primeira
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
        Follow-up
      </Badge>
    )
  }

  const formatDate = (dateString?: string) => {
    return adminMentoriasService.formatDate(dateString)
  }

  // A filtragem agora é feita pela API, não precisamos filtrar localmente
  const filteredMentorias = mentorias

  // Agrupar mentorias por negócio
  const mentoriasPorNegocio = filteredMentorias.reduce((acc, mentoria) => {
    const negocioId = mentoria.negocio.id
    if (!acc[negocioId]) {
      acc[negocioId] = {
        negocio: mentoria.negocio,
        mentorias: []
      }
    }
    acc[negocioId].mentorias.push(mentoria)
    return acc
  }, {} as Record<string, { negocio: Mentoria['negocio'], mentorias: Mentoria[] }>)

  const negociosComMentorias = Object.values(mentoriasPorNegocio)

  if (isLoading && !stats) {
    return <LoadingState />
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 -translate-y-16 -translate-x-8"></div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faHandshake} className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">Painel de Mentorias</h1>
            <p className="text-white/90 text-xl mb-1">Acompanhe todas as mentorias do sistema</p>
            <p className="text-white/80 text-base">Visualize estatísticas, NPS e gerencie mentorias</p>
          </div>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard
            title="Total de reuniões (agendadas, confirmadas e finalizadas)"
            value={stats.total_mentorias}
            icon={<FontAwesomeIcon icon={faHandshake} className="h-7 w-7 text-white" />}
            description={`${stats.mentorias_finalizadas} finalizadas de ${stats.total_mentorias} totais`}
            color="blue"
          />
          <MetricCard
            title="Mentorias Finalizadas"
            value={stats.mentorias_finalizadas}
            icon={<FontAwesomeIcon icon={faCheckCircle} className="h-7 w-7 text-white" />}
            description={`Taxa de conclusão: ${stats.taxa_conclusao.toFixed(1)}%`}
            color="green"
          />
          <MetricCard
            title="NPS Médio Geral"
            value={stats.nps_medio_geral.toFixed(1)}
            icon={<FontAwesomeIcon icon={faStar} className="h-7 w-7 text-white" />}
            description="Média de todas as avaliações"
            color="yellow"
          />
          <MetricCard
            title="Negócios com Mentores"
            value={stats.total_negocios_atendidos}
            icon={<FontAwesomeIcon icon={faBuilding} className="h-7 w-7 text-white" />}
            description={`Média de ${stats.media_mentorias_por_negocio.toFixed(1)} mentorias por negócio`}
            color="purple"
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-6">
          <TabsTrigger value="mentorias" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHandshake} className="h-4 w-4" />
            Mentorias
          </TabsTrigger>
          <TabsTrigger value="diagnosticos" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="h-4 w-4" />
            Diagnósticos
          </TabsTrigger>
        </TabsList>

        {/* Tab: Mentorias */}
        <TabsContent value="mentorias" className="space-y-6">
          {/* Filtros e Busca */}
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">Filtros e Busca</CardTitle>
                  <CardDescription>Filtre as mentorias por status, tipo e período</CardDescription>
                </div>
              </div>
            </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
                />
                <Input
                  id="search"
                  placeholder="Negócio, empreendedor ou mentor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                  <SelectItem value="AGENDADA">Agendada</SelectItem>
                  <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                  <SelectItem value="EM_ANDAMENTO">Em Andamento</SelectItem>
                  <SelectItem value="FINALIZADA">Finalizada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo-filter">Tipo</Label>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger id="tipo-filter">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Tipos</SelectItem>
                  <SelectItem value="primeira">Primeira Mentoria</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button
                onClick={handleExportCSV}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faFileExport} className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input
                id="data-inicio"
                type="date"
                value={dataInicioFilter}
                onChange={(e) => setDataInicioFilter(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input
                id="data-fim"
                type="date"
                value={dataFimFilter}
                onChange={(e) => setDataFimFilter(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Mentorias */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Lista de Mentorias ({mentorias.length})
                </CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? `Mostrando ${mentorias.length} resultado(s) para "${searchTerm}"`
                    : statusFilter !== "todos" || tipoFilter !== "todos" || dataInicioFilter || dataFimFilter
                      ? `Mostrando ${mentorias.length} mentoria(s) filtrada(s)`
                      : `Todas as ${mentorias.length} mentoria(s) do sistema`}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMentorias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FontAwesomeIcon icon={faHandshake} className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma mentoria encontrada
              </h3>
              <p className="text-gray-500 max-w-md">
                {searchTerm || statusFilter !== "todos" || tipoFilter !== "todos" || dataInicioFilter || dataFimFilter
                  ? 'Não encontramos mentorias com os filtros selecionados. Tente ajustar os filtros para ver mais resultados.'
                  : 'Não há mentorias cadastradas no sistema. Quando mentores agendarem mentorias, elas aparecerão aqui.'}
              </p>
              {(searchTerm || statusFilter !== "todos" || tipoFilter !== "todos" || dataInicioFilter || dataFimFilter) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("todos")
                    setTipoFilter("todos")
                    setDataInicioFilter("")
                    setDataFimFilter("")
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                <p className="text-gray-500">Carregando mentorias...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                {negociosComMentorias.map((item, index) => {
                  const totalMentorias = item.mentorias.length
                  const mentoriasFinalizadas = item.mentorias.filter(m => m.status === 'FINALIZADA').length
                  const npsMedia = item.mentorias
                    .filter(m => m.nps?.nps_medio)
                    .reduce((acc, m) => acc + (m.nps?.nps_medio || 0), 0) / 
                    (item.mentorias.filter(m => m.nps?.nps_medio).length || 1)

                  return (
                    <AccordionItem 
                      key={item.negocio.id} 
                      value={`negocio-${index}`}
                      className="border rounded-lg px-4 mb-2 hover:bg-gray-50 transition-colors"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {item.negocio.nome.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-left flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-semibold text-gray-900 text-base">
                                  {item.negocio.nome}
                                </h3>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {totalMentorias} {totalMentorias === 1 ? 'mentoria' : 'mentorias'}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {item.negocio.nome_empreendedor}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6 mr-4">
                            <div className="text-center">
                              <p className="text-xs text-gray-500">Finalizadas</p>
                              <p className="text-lg font-semibold text-green-600">{mentoriasFinalizadas}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-gray-500">NPS Médio</p>
                              <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-yellow-500" />
                                <p className="text-lg font-semibold text-yellow-600">
                                  {npsMedia > 0 ? npsMedia.toFixed(1) : '-'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-4">
                          <div className="space-y-3">
                            {item.mentorias.map((mentoria) => (
                              <div key={mentoria.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                  {/* Mentor */}
                                  <div className="col-span-3">
                                    <Label className="text-xs text-gray-500">Mentor</Label>
                                    <div className="mt-1">
                                      <p className="text-xs text-gray-500">{mentoria.mentor.email}</p>
                                    </div>
                                  </div>

                                  {/* Data */}
                                  <div className="col-span-2">
                                    <Label className="text-xs text-gray-500">Data Agendada</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <FontAwesomeIcon icon={faCalendar} className="h-3 w-3 text-gray-400" />
                                      <span className="text-sm text-gray-900">{formatDate(mentoria.data_agendada)}</span>
                                    </div>
                                  </div>

                                  {/* Tipo */}
                                  <div className="col-span-2">
                                    <Label className="text-xs text-gray-500">Tipo</Label>
                                    <div className="mt-1">{getTipoBadge(mentoria.tipo)}</div>
                                  </div>

                                  {/* Status */}
                                  <div className="col-span-2">
                                    <Label className="text-xs text-gray-500">Status</Label>
                                    <div className="mt-1">{getStatusBadge(mentoria.status)}</div>
                                  </div>

                                  {/* NPS */}
                                  <div className="col-span-1">
                                    <Label className="text-xs text-gray-500">NPS</Label>
                                    <div className="mt-1">
                                      {mentoria.nps?.nps_medio ? (
                                        <div className="flex items-center gap-1">
                                          <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-yellow-500" />
                                          <span className="font-semibold text-sm text-gray-900">
                                            {mentoria.nps.nps_medio.toFixed(1)}
                                          </span>
                                        </div>
                                      ) : (
                                        <span className="text-sm text-gray-400">-</span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Ações */}
                                  <div className="col-span-2 text-right">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => loadMentoriaDetails(mentoria.id)}
                                      disabled={isLoadingDetails}
                                      className="w-full"
                                    >
                                      <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                                      Ver Detalhes
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Espaçamento final */}
      <div className="h-8"></div>
        </TabsContent>

        {/* Tab: Diagnósticos */}
        <TabsContent value="diagnosticos" className="space-y-6">
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">Diagnósticos Preenchidos</CardTitle>
                    <CardDescription>
                      {totalDiagnosticos} diagnóstico{totalDiagnosticos !== 1 ? 's' : ''} preenchido{totalDiagnosticos !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                </div>
                <Button
                  onClick={handleExportDiagnosticos}
                  disabled={isExporting || diagnosticos.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExporting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faDownload} className="h-4 w-4 mr-2 text-white" />
                      <span className="text-white">Exportar CSV</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Barra de Pesquisa */}
              <div className="mb-6">
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
                  />
                  <Input
                    placeholder="Buscar por negócio, empreendedor ou mentor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {isLoadingDiagnosticos ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                    <p className="text-gray-500">Carregando diagnósticos...</p>
                  </div>
                </div>
              ) : diagnosticos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FontAwesomeIcon icon={faClipboardList} className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum diagnóstico encontrado</h3>
                  <p className="text-gray-500 text-center">
                    Não há diagnósticos preenchidos no período selecionado.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Negócio</TableHead>
                        <TableHead>Empreendedor</TableHead>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Data Mentoria</TableHead>
                        <TableHead>Dor Principal</TableHead>
                        <TableHead>Controle Financeiro</TableHead>
                        <TableHead>Marketing</TableHead>
                        <TableHead>Vendas</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {diagnosticos.map((diagnostico) => (
                        <TableRow key={diagnostico.diagnostico_id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{diagnostico.negocio.nome}</TableCell>
                          <TableCell>{diagnostico.negocio.empreendedor_nome}</TableCell>
                          <TableCell>{diagnostico.mentor.nome}</TableCell>
                          <TableCell>{formatDate(diagnostico.mentoria.data_agendada)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                              {diagnostico.dor_principal}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${(diagnostico.controle_financeiro / 4) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{diagnostico.controle_financeiro}/4</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                                <div 
                                  className="bg-purple-500 h-2 rounded-full" 
                                  style={{ width: `${(diagnostico.divulgação_marketing / 4) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{diagnostico.divulgação_marketing}/4</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${(diagnostico.atrair_clientes_vender / 4) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium">{diagnostico.atrair_clientes_vender}/4</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDiagnostico(diagnostico)}
                            >
                              <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                              Ver Completo
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Detalhes da Mentoria</DialogTitle>
            <DialogDescription>
              Informações completas da mentoria incluindo diagnóstico e checkout
            </DialogDescription>
          </DialogHeader>

          {selectedMentoria && (
            <div className="space-y-6">
              {/* Informações Gerais */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Negócio</Label>
                      <p className="font-medium">{selectedMentoria.negocio.nome}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Empreendedor</Label>
                      <p className="font-medium">{selectedMentoria.negocio.nome_empreendedor}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Mentor</Label>
                      <p className="font-medium">{selectedMentoria.mentor.nome}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedMentoria.status)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Tipo</Label>
                      <div className="mt-1">{getTipoBadge(selectedMentoria.tipo)}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Duração</Label>
                      <p className="font-medium">{selectedMentoria.duracao_minutos} minutos</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Data Agendada</Label>
                      <p className="font-medium">{formatDate(selectedMentoria.data_agendada)}</p>
                    </div>
                    {selectedMentoria.data_finalizada && (
                      <div>
                        <Label className="text-gray-500">Data Finalizada</Label>
                        <p className="font-medium">{formatDate(selectedMentoria.data_finalizada)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Avaliações (NPS) */}
              {selectedMentoria.nps && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-500" />
                      Avaliações (NPS)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Label className="text-gray-500">Nota Mentoria</Label>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                          {selectedMentoria.nps.nota_mentoria || '-'}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Label className="text-gray-500">Nota Mentor</Label>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                          {selectedMentoria.nps.nota_mentor || '-'}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Label className="text-gray-500">Nota Programa</Label>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                          {selectedMentoria.nps.nota_programa || '-'}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <Label className="text-gray-500">Média NPS</Label>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                          {selectedMentoria.nps.nps_medio?.toFixed(1) || '-'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Diagnóstico */}
              {selectedMentoria.diagnostico && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Diagnóstico</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      {selectedMentoria.diagnostico.tempo_mercado && (
                        <div>
                          <Label className="text-gray-500">Tempo de Mercado</Label>
                          <p className="font-medium">{selectedMentoria.diagnostico.tempo_mercado}</p>
                        </div>
                      )}
                      {selectedMentoria.diagnostico.faturamento_mensal && (
                        <div>
                          <Label className="text-gray-500">Faturamento Mensal</Label>
                          <p className="font-medium">{selectedMentoria.diagnostico.faturamento_mensal}</p>
                        </div>
                      )}
                      {selectedMentoria.diagnostico.num_funcionarios && (
                        <div>
                          <Label className="text-gray-500">Nº Funcionários</Label>
                          <p className="font-medium">{selectedMentoria.diagnostico.num_funcionarios}</p>
                        </div>
                      )}
                    </div>
                    {selectedMentoria.diagnostico.desafios && selectedMentoria.diagnostico.desafios.length > 0 && (
                      <div>
                        <Label className="text-gray-500">Desafios</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedMentoria.diagnostico.desafios.map((desafio, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {desafio}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedMentoria.diagnostico.observacoes && (
                      <div>
                        <Label className="text-gray-500">Observações</Label>
                        <p className="text-sm text-gray-700 mt-1">{selectedMentoria.diagnostico.observacoes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Checkout */}
              {selectedMentoria.checkout && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Checkout</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedMentoria.checkout.feedback && (
                      <div>
                        <Label className="text-gray-500">Feedback</Label>
                        <p className="text-sm text-gray-700 mt-1">{selectedMentoria.checkout.feedback}</p>
                      </div>
                    )}
                    {selectedMentoria.checkout.proximos_passos && (
                      <div>
                        <Label className="text-gray-500">Próximos Passos</Label>
                        <p className="font-medium mt-1">
                          {selectedMentoria.checkout.proximos_passos === 'nova_mentoria' 
                            ? 'Nova Mentoria' 
                            : 'Finalizar'}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDetailsModalOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Diagnóstico */}
      <Dialog open={isDiagnosticoModalOpen} onOpenChange={setIsDiagnosticoModalOpen}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Diagnóstico Completo</DialogTitle>
            <DialogDescription>
              Todas as informações coletadas no diagnóstico
            </DialogDescription>
          </DialogHeader>

          {selectedDiagnostico && (
            <div className="space-y-6">
              {/* Informações do Negócio */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-blue-600" />
                    Informações do Negócio
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Negócio</Label>
                    <p className="font-semibold">{selectedDiagnostico.negocio.nome}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Empreendedor</Label>
                    <p className="font-semibold">{selectedDiagnostico.negocio.empreendedor_nome}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Telefone</Label>
                    <p className="font-semibold">{selectedDiagnostico.telefone_whatsapp}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Setor de Atuação</Label>
                    <p className="font-semibold">{selectedDiagnostico.setor_atuacao}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status do Negócio</Label>
                    <p className="font-semibold">{selectedDiagnostico.status_negocio}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tempo de Funcionamento</Label>
                    <p className="font-semibold">{selectedDiagnostico.tempo_funcionamento}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Avaliações de Competências */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-green-600" />
                    Avaliações de Competências (1-4)
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Controle Financeiro</Label>
                      <span className="font-bold text-blue-600">{selectedDiagnostico.controle_financeiro}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.controle_financeiro / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Divulgação e Marketing</Label>
                      <span className="font-bold text-purple-600">{selectedDiagnostico.divulgação_marketing}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.divulgação_marketing / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Atrair Clientes / Vender</Label>
                      <span className="font-bold text-green-600">{selectedDiagnostico.atrair_clientes_vender}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.atrair_clientes_vender / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Atender Clientes</Label>
                      <span className="font-bold text-indigo-600">{selectedDiagnostico.atender_clientes}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-indigo-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.atender_clientes / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Ferramentas de Gestão</Label>
                      <span className="font-bold text-orange-600">{selectedDiagnostico.ferramentas_gestao}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.ferramentas_gestao / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Organização do Negócio</Label>
                      <span className="font-bold text-pink-600">{selectedDiagnostico.organizacao_negocio}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-pink-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.organizacao_negocio / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-gray-700">Obrigações Legais/Jurídicas</Label>
                      <span className="font-bold text-red-600">{selectedDiagnostico.obrigacoes_legais_juridicas}/4</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-red-500 h-3 rounded-full transition-all" 
                        style={{ width: `${(selectedDiagnostico.obrigacoes_legais_juridicas / 4) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Desafios e Dores */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-orange-600" />
                    Desafios e Dores
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-gray-500">Dor Principal</Label>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 text-base mt-1">
                      {selectedDiagnostico.dor_principal}
                    </Badge>
                  </div>
                  {selectedDiagnostico.falta_caixa_financiamento && (
                    <div>
                      <Label className="text-gray-500">Falta de Caixa/Financiamento</Label>
                      <p className="text-gray-900 mt-1">{selectedDiagnostico.falta_caixa_financiamento}</p>
                    </div>
                  )}
                  {selectedDiagnostico.dificuldade_funcionarios && (
                    <div>
                      <Label className="text-gray-500">Dificuldade com Funcionários</Label>
                      <p className="text-gray-900 mt-1">{selectedDiagnostico.dificuldade_funcionarios}</p>
                    </div>
                  )}
                  {selectedDiagnostico.clientes_reclamando && (
                    <div>
                      <Label className="text-gray-500">Clientes Reclamando</Label>
                      <p className="text-gray-900 mt-1">{selectedDiagnostico.clientes_reclamando}</p>
                    </div>
                  )}
                  {selectedDiagnostico.relacionamento_fornecedores && (
                    <div>
                      <Label className="text-gray-500">Relacionamento com Fornecedores</Label>
                      <p className="text-gray-900 mt-1">{selectedDiagnostico.relacionamento_fornecedores}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Perfil Empreendedor */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-purple-600" />
                    Perfil Empreendedor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-500">Perfil de Investimento</Label>
                      <p className="font-semibold">{selectedDiagnostico.perfil_investimento}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Motivo de Desistência</Label>
                      <p className="font-semibold">{selectedDiagnostico.motivo_desistencia}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Comportamento Empreendedor */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-teal-600" />
                    Comportamento Empreendedor (1-4)
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'agir_primeiro_consequencias_depois', label: 'Agir primeiro, consequências depois' },
                    { key: 'pensar_varias_solucoes', label: 'Pensar em várias soluções' },
                    { key: 'seguir_primeiro_pressentimento', label: 'Seguir primeiro pressentimento' },
                    { key: 'fazer_coisas_antes_prazo', label: 'Fazer coisas antes do prazo' },
                    { key: 'fracasso_nao_opcao', label: 'Fracasso não é opção' },
                    { key: 'decisao_negocio_correta', label: 'Decisões de negócio são corretas' },
                    { key: 'focar_oportunidades_riscos', label: 'Focar em oportunidades vs riscos' },
                    { key: 'acreditar_sucesso', label: 'Acreditar no sucesso' }
                  ].map((item) => {
                    const value = selectedDiagnostico[item.key as keyof Diagnostico] as number
                    return (
                      <div key={item.key}>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-gray-700 text-sm">{item.label}</Label>
                          <span className="font-bold text-stone-green-dark">{value}/4</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-stone-green-light h-2 rounded-full transition-all" 
                            style={{ width: `${(value / 4) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Informações da Mentoria */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FontAwesomeIcon icon={faHandshake} className="h-5 w-5 text-green-600" />
                    Informações da Mentoria
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Mentor</Label>
                    <p className="font-semibold">{selectedDiagnostico.mentor.nome}</p>
                    <p className="text-sm text-gray-600">{selectedDiagnostico.mentor.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Data da Mentoria</Label>
                    <p className="font-semibold">{formatDate(selectedDiagnostico.mentoria.data_agendada)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tipo</Label>
                    {getTipoBadge(selectedDiagnostico.mentoria.tipo)}
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    {getStatusBadge(selectedDiagnostico.mentoria.status)}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDiagnosticoModalOpen(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

