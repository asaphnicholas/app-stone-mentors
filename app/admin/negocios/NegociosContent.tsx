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
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons"
import { businessesService, type Business, type BusinessFilters, type AvailableMentor, type CreateBusinessRequest } from "@/lib/services/businesses"
import { useToast } from "@/components/ui/toast"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"
import { formatDateToBR } from "@/lib/utils/date"

export default function NegociosContent() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [availableMentors, setAvailableMentors] = useState<AvailableMentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
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
    faturamento_mensal: undefined,
    numero_funcionarios: undefined,
    desafios_principais: "",
    objetivos_mentoria: "",
    observacoes: ""
  })

  const { addToast } = useToast()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted) {
      loadData()
    }
  }, [isMounted])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [businessesData, mentorsData] = await Promise.all([
        businessesService.getBusinesses(),
        businessesService.getAvailableMentors()
      ])
      
      setBusinesses(businessesData.businesses || [])
      setAvailableMentors(mentorsData)
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
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao vincular mentor",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const openAssignDialog = (business: Business) => {
    setSelectedBusiness(business)
    setIsAssignDialogOpen(true)
  }

  // Filter businesses based on search and filters
  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch = business.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || business.status === statusFilter
    const matchesArea = !areaFilter || business.area_atuacao === areaFilter
    const matchesMentor = !mentorFilter || 
                         (mentorFilter === "com_mentor" && business.mentor_id) ||
                         (mentorFilter === "sem_mentor" && !business.mentor_id)
    
    return matchesSearch && matchesStatus && matchesArea && matchesMentor
  })

  // Separate businesses by status
  const businessesWithoutMentor = filteredBusinesses.filter(b => !b.mentor_id)
  const businessesWithMentor = filteredBusinesses.filter(b => b.mentor_id)

  // Garantir renderização só no client
  if (!isMounted || isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Negócios</h1>
          <p className="text-gray-600">Gerencie negócios e vincule mentores</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white">
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4 mr-2" />
              Novo Negócio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Negócio</DialogTitle>
              <DialogDescription>
                Preencha as informações do negócio. Campos marcados com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Negócio *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Tech Startup"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area_atuacao">Área de Atuação *</Label>
                  <Select value={formData.area_atuacao} onValueChange={(value) => setFormData({ ...formData, area_atuacao: value })}>
                    <SelectTrigger>
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
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descreva o negócio..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localizacao">Localização</Label>
                  <Input
                    id="localizacao"
                    value={formData.localizacao}
                    onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                    placeholder="Ex: São Paulo, SP"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tamanho_empresa">Tamanho da Empresa</Label>
                  <Input
                    id="tamanho_empresa"
                    value={formData.tamanho_empresa}
                    onChange={(e) => setFormData({ ...formData, tamanho_empresa: e.target.value })}
                    placeholder="Ex: Pequena, Média, Grande"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="faturamento_mensal">Faturamento Mensal (R$)</Label>
                  <Input
                    id="faturamento_mensal"
                    type="number"
                    value={formData.faturamento_mensal || ""}
                    onChange={(e) => setFormData({ ...formData, faturamento_mensal: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_funcionarios">Número de Funcionários</Label>
                  <Input
                    id="numero_funcionarios"
                    type="number"
                    value={formData.numero_funcionarios || ""}
                    onChange={(e) => setFormData({ ...formData, numero_funcionarios: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desafios_principais">Desafios Principais</Label>
                <Textarea
                  id="desafios_principais"
                  value={formData.desafios_principais}
                  onChange={(e) => setFormData({ ...formData, desafios_principais: e.target.value })}
                  placeholder="Descreva os principais desafios do negócio..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivos_mentoria">Objetivos da Mentoria</Label>
                <Textarea
                  id="objetivos_mentoria"
                  value={formData.objetivos_mentoria}
                  onChange={(e) => setFormData({ ...formData, objetivos_mentoria: e.target.value })}
                  placeholder="Descreva os objetivos da mentoria..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  placeholder="Observações adicionais..."
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateBusiness}
                disabled={!formData.nome || !formData.area_atuacao}
                className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
              >
                Criar Negócio
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Buscar</Label>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Nome ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="ATIVO">Ativo</SelectItem>
                  <SelectItem value="INATIVO">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Área de Atuação</Label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Mentor</Label>
              <Select value={mentorFilter} onValueChange={setMentorFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="com_mentor">Com Mentor</SelectItem>
                  <SelectItem value="sem_mentor">Sem Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Businesses without mentor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-orange-500" />
            Aguardando Mentor ({businessesWithoutMentor.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businessesWithoutMentor.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faCheckCircle} className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Nenhum negócio aguardando mentor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessesWithoutMentor.map((business) => (
                <Card key={business.id} className="border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-gray-500" />
                          <h3 className="font-semibold text-lg">{business.nome}</h3>
                          <Badge variant="outline">{business.area_atuacao}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          {business.localizacao && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                              {business.localizacao}
                            </div>
                          )}
                          {business.tamanho_empresa && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                              {business.tamanho_empresa}
                            </div>
                          )}
                          {business.numero_funcionarios && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                              {business.numero_funcionarios} funcionários
                            </div>
                          )}
                        </div>
                        
                        {business.descricao && (
                          <p className="text-sm text-gray-600 mt-2">{business.descricao}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => openAssignDialog(business)}
                          className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
                        >
                          <FontAwesomeIcon icon={faUserTie} className="h-4 w-4 mr-1" />
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="h-5 w-5 text-green-500" />
            Com Mentor ({businessesWithMentor.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {businessesWithMentor.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faUsers} className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Nenhum negócio com mentor vinculado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessesWithMentor.map((business) => (
                <Card key={business.id} className="border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-gray-500" />
                          <h3 className="font-semibold text-lg">{business.nome}</h3>
                          <Badge variant="outline">{business.area_atuacao}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {business.localizacao && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="h-4 w-4" />
                              {business.localizacao}
                            </div>
                          )}
                          {business.tamanho_empresa && (
                            <div className="flex items-center gap-2">
                              <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                              {business.tamanho_empresa}
                            </div>
                          )}
                        </div>
                        
                        {business.mentor_nome && (
                          <div className="flex items-center gap-2 text-sm">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {business.mentor_nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">Mentor: {business.mentor_nome}</span>
                            {business.data_vinculacao && (
                              <span className="text-gray-500">
                                • Vinculado em {formatDateToBR(business.data_vinculacao)}
                              </span>
                            )}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Vincular Mentor</DialogTitle>
            <DialogDescription>
              Selecione um mentor para o negócio "{selectedBusiness?.nome}".
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mentor">Mentor</Label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um mentor" />
                </SelectTrigger>
                <SelectContent>
                  {availableMentors.map((mentor) => (
                    <SelectItem key={mentor.id} value={mentor.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{mentor.nome}</span>
                        <span className="text-sm text-gray-500">
                          {mentor.areas_especializacao} • {mentor.negocios_ativo} negócios ativos
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={assignObservations}
                onChange={(e) => setAssignObservations(e.target.value)}
                placeholder="Observações sobre a vinculação..."
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignMentor}
              disabled={!selectedMentor}
              className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white"
            >
              Vincular Mentor
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
