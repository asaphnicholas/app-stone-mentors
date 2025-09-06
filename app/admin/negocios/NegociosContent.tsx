"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faBuilding, 
  faClock, 
  faUser, 
  faMapMarkerAlt, 
  faSearch, 
  faPlus,
  faUsers,
  faChartLine,
  faUserTie,
  faCheckCircle,
  faExclamationTriangle,
  faHandshake,
  faRocket,
  faFilter,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons"
import { businessesService, type Business, type BusinessFilters, type AvailableMentor, type CreateBusinessRequest } from "@/lib/services/businesses"
import { useToast } from "@/components/ui/toast"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"
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
    {/* Header Loading */}
    <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faBuilding} className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Gerenciar Negócios</h1>
            <p className="text-white/90 text-xl">Carregando dados...</p>
            <p className="text-white/80 text-base">Aguarde um momento</p>
          </div>
        </div>
        <div className="w-40 h-12 bg-white/20 rounded-lg animate-pulse"></div>
      </div>
    </div>

    {/* Stats Loading */}
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

    {/* Content Loading */}
    <div className="space-y-6">
      {[1, 2].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-20 bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function NegociosContent() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [availableMentors, setAvailableMentors] = useState<AvailableMentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [areaFilter, setAreaFilter] = useState<string>("")
  const [mentorFilter, setMentorFilter] = useState<string>("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [selectedMentor, setSelectedMentor] = useState<string>("")
  const [assignObservations, setAssignObservations] = useState("")
  
  // Form state for creating business
  const [formData, setFormData] = useState<CreateBusinessRequest>({
    nome: "",
    descricao: "",
    area_atuacao: "",
    localizacao: "",
    tamanho_empresa: "",
    nome_empreendedor: "",
    telefone: "",
    faturamento_mensal: undefined,
    numero_funcionarios: undefined,
    desafios_principais: "",
    objetivos_mentoria: "",
    observacoes: ""
  })

  const { addToast } = useToast()
  const isHydrated = useHydration()

  // Função para formatar valor em reais para exibição
  const formatCurrencyDisplay = (value: number | undefined): string => {
    if (!value) return ""
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Função para formatar input em tempo real
  const formatCurrencyInput = (value: string): string => {
    if (!value) return ""
    
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '')
    
    if (!numbers) return ""
    
    // Converte para número e divide por 100 para considerar centavos
    const amount = parseInt(numbers) / 100
    
    // Formata como moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Função para converter string formatada para número
  const parseCurrency = (value: string): number | undefined => {
    if (!value) return undefined
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '')
    if (!numbers) return undefined
    
    // Converte para número e divide por 100 para considerar centavos
    const amount = parseInt(numbers) / 100
    return isNaN(amount) ? undefined : amount
  }

  // Função para formatar telefone
  const formatPhone = (value: string): string => {
    if (!value) return ""
    
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '')
    
    if (numbers.length <= 2) {
      return numbers
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}${numbers.slice(7, 11)}`
    }
  }

  useEffect(() => {
    if (isHydrated) {
      loadData()
    }
  }, [isHydrated])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const businessesData = await businessesService.getBusinesses()
      
      setBusinesses(businessesData.businesses || [])
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

  const handleCreateBusiness = async () => {
    try {
      await businessesService.createBusiness(formData)
      
      addToast({
        type: "success",
        title: "Negócio criado!",
        message: `"${formData.nome}" foi criado com sucesso.`,
      })
      
      setIsCreateDialogOpen(false)
      setFormData({
        nome: "",
        descricao: "",
        area_atuacao: "",
        localizacao: "",
        tamanho_empresa: "",
        nome_empreendedor: "",
        telefone: "",
        faturamento_mensal: undefined,
        numero_funcionarios: undefined,
        desafios_principais: "",
        objetivos_mentoria: "",
        observacoes: ""
      })
      loadData()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao criar negócio",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const handleAssignMentor = async () => {
    if (!selectedBusiness || !selectedMentor) return

    try {
      await businessesService.assignMentor(selectedBusiness.id, {
        mentor_id: selectedMentor,
        observacoes: assignObservations || undefined
      })
      
      addToast({
        type: "success",
        title: "Mentor vinculado!",
        message: `Mentor foi vinculado ao negócio "${selectedBusiness.nome}".`,
      })
      
      setIsAssignDialogOpen(false)
      setSelectedBusiness(null)
      setSelectedMentor("")
      setAssignObservations("")
      loadData()
    } catch (error: any) {
      let errorTitle = "Erro ao vincular mentor"
      let errorMessage = "Erro interno do servidor"
      
      // Tratamento específico de erros da API
      if (error.status === 400) {
        errorTitle = "Negócio já possui mentor"
        errorMessage = `O negócio "${selectedBusiness.nome}" já possui um mentor vinculado.`
      } else if (error.status === 404) {
        if (error.message?.includes('Mentor não encontrado') || error.message?.includes('não qualificado')) {
          errorTitle = "Mentor não encontrado"
          errorMessage = "O mentor selecionado não foi encontrado ou não está qualificado para mentoria."
        } else {
          errorTitle = "Mentor não qualificado"
          errorMessage = `O mentor não esta qualidficado para mentoria.`
        }
      } else if (error.status === 500) {
        errorTitle = "Erro interno do servidor"
        errorMessage = "Ocorreu um erro interno. Tente novamente em alguns instantes."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      addToast({
        type: "error",
        title: errorTitle,
        message: errorMessage,
      })
    }
  }

  const openAssignDialog = async (business: Business) => {
    setSelectedBusiness(business)
    setIsAssignDialogOpen(true)
    
    // Carregar mentores disponíveis quando abrir a modal
    try {
      const mentorsData = await businessesService.getAvailableMentors()
      setAvailableMentors(mentorsData)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar mentores",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  // Filter businesses based on search and filters
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || statusFilter === "all" || business.status === statusFilter
    const matchesArea = !areaFilter || areaFilter === "all" || business.area_atuacao === areaFilter
    const matchesMentor = !mentorFilter || mentorFilter === "all" ||
                         (mentorFilter === "com_mentor" && business.mentor_id) ||
                         (mentorFilter === "sem_mentor" && !business.mentor_id)
    
    return matchesSearch && matchesStatus && matchesArea && matchesMentor
  })

  // Separate businesses by status
  const businessesWithoutMentor = filteredBusinesses.filter(b => !b.mentor_id)
  const businessesWithMentor = filteredBusinesses.filter(b => b.mentor_id)

  // Renderizar loading state até hidratação completa ou enquanto carrega dados
  if (!isHydrated || isLoading) {
    return <LoadingState />
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
              <FontAwesomeIcon icon={faBuilding} className="h-10 w-10 text-white" />
            </div>
        <div>
              <h1 className="text-4xl font-bold mb-2">Gerenciar Negócios</h1>
              <p className="text-white/90 text-xl">Gerencie negócios e vincule mentores especializados</p>
              <p className="text-white/80 text-base">Conecte empreendedores com mentores qualificados</p>
            </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6">
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-3" />
              Novo Negócio
            </Button>
          </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Criar Novo Negócio</DialogTitle>
                <DialogDescription className="text-gray-600">
                Preencha as informações do negócio. Campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
              <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nome" className="text-sm font-medium text-gray-700">Nome do Negócio *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Tech Startup"
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="area_atuacao" className="text-sm font-medium text-gray-700">Área de Atuação *</Label>
                  <Select value={formData.area_atuacao} onValueChange={(value) => setFormData({ ...formData, area_atuacao: value })}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                      <SelectValue placeholder="Selecione a área" />
                    </SelectTrigger>
                    <SelectContent>
                      {AREAS_ATUACAO.map((area) => (
                        <SelectItem key={area.value} value={area.value}>
                          {area.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-sm font-medium text-gray-700">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o negócio..."
                    rows={4}
                    className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="localizacao" className="text-sm font-medium text-gray-700">Localização</Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tamanho_empresa" className="text-sm font-medium text-gray-700">Tamanho da Empresa</Label>
                    <Select value={formData.tamanho_empresa} onValueChange={(value) => setFormData({ ...formData, tamanho_empresa: value })}>
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MICRO">Microempresa (até 9 funcionários)</SelectItem>
                        <SelectItem value="PEQUENA">Pequena (10-49 funcionários)</SelectItem>
                        <SelectItem value="MEDIA">Média (50-249 funcionários)</SelectItem>
                        <SelectItem value="GRANDE">Grande (250+ funcionários)</SelectItem>
                        <SelectItem value="STARTUP">Startup</SelectItem>
                        <SelectItem value="MEI">MEI (Microempreendedor Individual)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome_empreendedor" className="text-sm font-medium text-gray-700">Nome do Empreendedor *</Label>
                    <Input
                      id="nome_empreendedor"
                      value={formData.nome_empreendedor}
                      onChange={(e) => setFormData({ ...formData, nome_empreendedor: e.target.value })}
                      placeholder="Nome completo do empreendedor"
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">Telefone *</Label>
                  <Input
                      id="telefone"
                      type="text"
                      value={formData.telefone}
                      onChange={(e) => {
                        const formatted = formatPhone(e.target.value)
                        setFormData({ ...formData, telefone: formatted })
                      }}
                      placeholder="(48) 988312500"
                      maxLength={15}
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="faturamento_mensal" className="text-sm font-medium text-gray-700">Faturamento Mensal</Label>
                  <Input
                    id="faturamento_mensal"
                      type="text"
                      value={formData.faturamento_mensal ? formatCurrencyDisplay(formData.faturamento_mensal) : ""}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value)
                        const parsed = parseCurrency(formatted)
                        setFormData({ ...formData, faturamento_mensal: parsed })
                      }}
                      placeholder="Digite o valor (ex: 1000)"
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="numero_funcionarios" className="text-sm font-medium text-gray-700">Número de Funcionários</Label>
                  <Input
                    id="numero_funcionarios"
                    type="number"
                    value={formData.numero_funcionarios || ""}
                    onChange={(e) => setFormData({ ...formData, numero_funcionarios: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                      className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="desafios_principais" className="text-sm font-medium text-gray-700">Desafios Principais</Label>
                <Textarea
                  id="desafios_principais"
                  value={formData.desafios_principais}
                  onChange={(e) => setFormData({ ...formData, desafios_principais: e.target.value })}
                  placeholder="Descreva os principais desafios do negócio..."
                  rows={3}
                    className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="objetivos_mentoria" className="text-sm font-medium text-gray-700">Objetivos da Mentoria</Label>
                <Textarea
                  id="objetivos_mentoria"
                  value={formData.objetivos_mentoria}
                  onChange={(e) => setFormData({ ...formData, objetivos_mentoria: e.target.value })}
                  placeholder="Descreva os objetivos da mentoria..."
                  rows={3}
                    className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                />
              </div>

              <div className="space-y-2">
                  <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={2}
                    className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
                />
              </div>
            </div>
            
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
                  className="px-8 py-3"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateBusiness}
                  disabled={!formData.nome || !formData.area_atuacao || !formData.nome_empreendedor || !formData.telefone}
                  className="px-8 py-3 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
              >
                  <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
                Criar Negócio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-green-light/10 to-stone-green-dark/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Negócios</p>
                <p className="text-2xl font-bold text-gray-900">{businesses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Aguardando Mentor</p>
                <p className="text-2xl font-bold text-gray-900">{businessesWithoutMentor.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Com Mentor</p>
                <p className="text-2xl font-bold text-gray-900">{businessesWithMentor.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faFilter} className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">Filtros e Busca</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Buscar</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Nome ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Área de Atuação</Label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Mentor</Label>
              <Select value={mentorFilter} onValueChange={setMentorFilter}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="com_mentor">Com Mentor</SelectItem>
                  <SelectItem value="sem_mentor">Sem Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses without mentor */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
            Aguardando Mentor ({businessesWithoutMentor.length})
          </CardTitle>
              <p className="text-gray-600">Negócios que precisam ser vinculados a mentores</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {businessesWithoutMentor.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FontAwesomeIcon icon={faCheckCircle} className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Todos os negócios têm mentores!</h3>
              <p className="text-gray-600">Nenhum negócio está aguardando mentor no momento</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessesWithoutMentor.map((business) => (
                <Card key={business.id} className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{business.nome}</h3>
                            <Badge className="bg-stone-green-light/10 text-stone-green-dark border-0 mt-1">
                              {business.area_atuacao}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                          {business.localizacao && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-stone-green-dark" />
                              <span className="font-medium">{business.localizacao}</span>
                            </div>
                          )}
                          {business.tamanho_empresa && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-stone-green-dark" />
                              <span className="font-medium">{business.tamanho_empresa}</span>
                            </div>
                          )}
                          {business.numero_funcionarios && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-stone-green-dark" />
                              <span className="font-medium">{business.numero_funcionarios} funcionários</span>
                            </div>
                          )}
                        </div>
                        
                        {business.descricao && (
                          <p className="text-gray-600 leading-relaxed">{business.descricao}</p>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        <Button
                          onClick={() => openAssignDialog(business)}
                          className="bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-12 px-6"
                        >
                          <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 mr-2" />
                          Vincular Mentor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Businesses with mentor */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
            Com Mentor ({businessesWithMentor.length})
          </CardTitle>
              <p className="text-gray-600">Negócios que já possuem mentores vinculados</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {businessesWithMentor.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FontAwesomeIcon icon={faUsers} className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum negócio com mentor</h3>
              <p className="text-gray-600">Comece vinculando mentores aos negócios disponíveis</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessesWithMentor.map((business) => (
                <Card key={business.id} className="border-0 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{business.nome}</h3>
                            <Badge className="bg-stone-green-light/10 text-stone-green-dark border-0 mt-1">
                              {business.area_atuacao}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                          {business.localizacao && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4 text-stone-green-dark" />
                              <span className="font-medium">{business.localizacao}</span>
                            </div>
                          )}
                          {business.tamanho_empresa && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-stone-green-dark" />
                              <span className="font-medium">{business.tamanho_empresa}</span>
                            </div>
                          )}
                        </div>
                        
                        {business.mentor_nome && (
                          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-stone-green-light/10 to-stone-green-dark/10 rounded-xl border border-stone-green-light/20">
                            <Avatar className="h-10 w-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark">
                              <AvatarFallback className="text-white font-semibold">
                                {business.mentor_nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">Mentor: {business.mentor_nome}</p>
                            {business.data_vinculacao && (
                                <p className="text-sm text-gray-600">
                                  Vinculado em {formatDateToBR(business.data_vinculacao)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Mentor Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Vincular Mentor</DialogTitle>
            <DialogDescription className="text-gray-600">
              Selecione um mentor para o negócio "{selectedBusiness?.nome}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="mentor" className="text-sm font-medium text-gray-700">Mentor</Label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200">
                  <SelectValue placeholder="Selecione um mentor" />
                </SelectTrigger>
                <SelectContent>
                  {availableMentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{mentor.nome}</span>
                        <span className="text-sm text-gray-500">
                          {mentor.area_atuacao} • {mentor.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={assignObservations}
                onChange={(e) => setAssignObservations(e.target.value)}
                placeholder="Observações sobre a vinculação..."
                rows={4}
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 resize-none"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
              className="px-6 py-2"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignMentor}
              disabled={!selectedMentor}
              className="px-6 py-2 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
            >
              <FontAwesomeIcon icon={faHandshake} className="h-4 w-4 mr-2" />
              Vincular Mentor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}