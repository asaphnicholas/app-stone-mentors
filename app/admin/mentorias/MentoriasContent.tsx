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
  faChevronDown
} from "@fortawesome/free-solid-svg-icons"
import adminMentoriasService, { 
  type MentoriaStats,
  type Mentoria,
  type MentoriaDetalhes
} from "@/lib/services/admin-mentorias"

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
  const [stats, setStats] = useState<MentoriaStats | null>(null)
  const [mentorias, setMentorias] = useState<Mentoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados de filtros
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")
  const [dataInicioFilter, setDataInicioFilter] = useState<string>("")
  const [dataFimFilter, setDataFimFilter] = useState<string>("")

  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalMentorias, setTotalMentorias] = useState(0)
  const itemsPerPage = 20

  // Modal de detalhes
  const [selectedMentoria, setSelectedMentoria] = useState<MentoriaDetalhes | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  useEffect(() => {
    loadStats()
    loadMentorias()
  }, [])

  // Resetar página quando filtros mudarem
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [statusFilter, tipoFilter, dataInicioFilter, dataFimFilter, searchTerm])

  // Carregar mentorias quando filtros ou página mudarem
  useEffect(() => {
    loadMentorias()
  }, [statusFilter, tipoFilter, dataInicioFilter, dataFimFilter, currentPage, searchTerm])

  // Atualizar estatísticas quando filtros de data mudarem
  useEffect(() => {
    loadStats()
  }, [dataInicioFilter, dataFimFilter])

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
        skip: (currentPage - 1) * itemsPerPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
      }

      console.log('Carregando mentorias - Página:', currentPage, 'Filtros:', params)

      const result = await adminMentoriasService.listMentorias(params)
      
      setMentorias(result.mentorias)
      setTotalMentorias(result.total)
      setTotalPages(Math.ceil(result.total / itemsPerPage))

      console.log('Mentorias carregadas:', result.mentorias.length, 'de', result.total, 'total')
      
      // Scroll para o topo da lista ao carregar novos dados
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Erro ao carregar mentorias:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar mentorias",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
      
      // Em caso de erro, limpar a lista
      setMentorias([])
      setTotalMentorias(0)
      setTotalPages(1)
    } finally {
      setIsLoading(false)
    }
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
    return tipo === "PRIMEIRA" ? (
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
            title="Total de Mentorias"
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
            title="Negócios Atendidos"
            value={stats.total_negocios_atendidos}
            icon={<FontAwesomeIcon icon={faBuilding} className="h-7 w-7 text-white" />}
            description={`Média de ${stats.media_mentorias_por_negocio.toFixed(1)} mentorias por negócio`}
            color="purple"
          />
        </div>
      )}

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
                  <SelectItem value="PRIMEIRA">Primeira Mentoria</SelectItem>
                  <SelectItem value="FOLLOWUP">Follow-up</SelectItem>
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
                  Lista de Mentorias ({totalMentorias})
                </CardTitle>
                <CardDescription>
                  {searchTerm 
                    ? `Resultados para "${searchTerm}"`
                    : statusFilter !== "todos" || tipoFilter !== "todos" || dataInicioFilter || dataFimFilter
                      ? 'Mentorias filtradas'
                      : 'Todas as mentorias do sistema'}
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
                    setCurrentPage(1)
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
                              <Card key={mentoria.id} className="bg-gray-50 border-gray-200 hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Mentor */}
                                    <div className="col-span-3">
                                      <Label className="text-xs text-gray-500">Mentor</Label>
                                      <div className="mt-1">
                                        <p className="font-medium text-sm text-gray-900">{mentoria.mentor.nome}</p>
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
                                </CardContent>
                              </Card>
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t mt-8">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a{' '}
                {Math.min(currentPage * itemsPerPage, totalMentorias)} de {totalMentorias} mentorias
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-500">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Espaçamento final */}
      <div className="h-8"></div>

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
    </div>
  )
}

