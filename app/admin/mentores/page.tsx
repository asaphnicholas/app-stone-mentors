"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { MentorDetailsModal } from "@/components/ui/mentor-details-modal"
import { useToast } from "@/components/ui/toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faSearch, 
  faUserCheck,
  faFileAlt,
  faSpinner,
  faTimes
} from "@fortawesome/free-solid-svg-icons"
import { mentorsService } from "@/lib/services/mentors"
import { usersService } from "@/lib/services/users"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"

interface Mentor {
  id: string
  nome: string
  email: string
  telefone?: string
  area_atuacao: string
  status: string
  protocolo_concluido: boolean
  created_at: string
  last_login?: string
}

export default function AdminMentoresPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Estados para filtros
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [areaFilter, setAreaFilter] = useState<string>('todas')
  const [qualificacaoFilter, setQualificacaoFilter] = useState<string>('todos')
  
  // Estados para modal de detalhes
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const [selectedMentorName, setSelectedMentorName] = useState<string>("")
  const [isMentorDetailsOpen, setIsMentorDetailsOpen] = useState(false)
  
  const { addToast } = useToast()

  useEffect(() => {
    loadMentors()
  }, [])

  useEffect(() => {
    // Aplicar todos os filtros
    let filtered = [...mentors]
    
    // Filtro de busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(mentor =>
        mentor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mentor.telefone && mentor.telefone.includes(searchTerm))
      )
    }
    
    // Filtro de status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(mentor => 
        mentor.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }
    
    // Filtro de área de atuação
    if (areaFilter !== 'todas') {
      filtered = filtered.filter(mentor => 
        mentor.area_atuacao === areaFilter
      )
    }
    
    // Filtro de qualificação
    if (qualificacaoFilter === 'qualificado') {
      filtered = filtered.filter(mentor => mentor.protocolo_concluido)
    } else if (qualificacaoFilter === 'nao_qualificado') {
      filtered = filtered.filter(mentor => !mentor.protocolo_concluido)
    }
    
    setFilteredMentors(filtered)
  }, [searchTerm, statusFilter, areaFilter, qualificacaoFilter, mentors])
  
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setAreaFilter("todas")
    setQualificacaoFilter("todos")
  }
  
  const hasActiveFilters = () => {
    return searchTerm.trim() !== "" || 
           statusFilter !== "todos" || 
           areaFilter !== "todas" || 
           qualificacaoFilter !== "todos"
  }

  const loadMentors = async () => {
    try {
      setIsLoading(true)
      
      const queryParams = new URLSearchParams()
      queryParams.append('role', 'mentor')
      queryParams.append('limit', '0') // Buscar todos
      
      const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        let users: Mentor[] = []
        
        if (Array.isArray(data)) {
          users = data
        } else {
          users = data.mentors || data.usuarios || data.data || []
        }
        
        setMentors(users)
        setFilteredMentors(users)
      } else {
        throw new Error('Erro ao carregar mentores')
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar mentores",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRowClick = (mentor: Mentor) => {
    setSelectedMentorId(mentor.id)
    setSelectedMentorName(mentor.nome)
    setIsMentorDetailsOpen(true)
  }

  const closeMentorDetails = () => {
    setSelectedMentorId(null)
    setSelectedMentorName("")
    setIsMentorDetailsOpen(false)
  }

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    
    switch (statusLower) {
      case 'ativo':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativo</Badge>
      case 'inativo':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Inativo</Badge>
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>
      case 'qualificado':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Qualificado</Badge>
      case 'ocupado':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Ocupado</Badge>
      case 'indisponivel':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Indisponível</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Mentores</h1>
            <p className="text-gray-600 mt-2">Gerencie mentores, aprove cadastros e monitore performance</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 animate-spin text-gray-400 mb-4" />
              <p className="text-gray-500">Carregando mentores...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Mentores</h1>
          <p className="text-gray-600 mt-2">Gerencie mentores, aprove cadastros e monitore performance</p>
        </div>
        <Button 
          className="border-2 border-gray-300"
          onClick={() => {
            // TODO: Implementar exportação de relatório
            addToast({
              type: "info",
              title: "Em desenvolvimento",
              message: "Funcionalidade de exportação em breve",
            })
          }}
        >
          <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>

      {/* Search Bar e Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar e Filtrar Mentores</CardTitle>
          <CardDescription>
            Busque mentores por nome, email ou telefone e aplique filtros para refinar os resultados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Campo de Busca */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
            />
            <Input
              placeholder="Buscar mentores por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro de Status */}
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="ocupado">Ocupado</SelectItem>
                  <SelectItem value="indisponivel">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Área de Atuação */}
            <div className="space-y-2">
              <Label htmlFor="area-filter">Área de Atuação</Label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger id="area-filter">
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Áreas</SelectItem>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={String(area.value)} value={String(area.value)}>
                      {String(area.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Filtro de Qualificação */}
            <div className="space-y-2">
              <Label htmlFor="qualificacao-filter">Qualificação</Label>
              <Select value={qualificacaoFilter} onValueChange={setQualificacaoFilter}>
                <SelectTrigger id="qualificacao-filter">
                  <SelectValue placeholder="Todas as qualificações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Qualificações</SelectItem>
                  <SelectItem value="qualificado">Qualificados</SelectItem>
                  <SelectItem value="nao_qualificado">Não Qualificados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Botão Limpar Filtros e Contador */}
          <div className="flex items-center justify-between pt-2 border-t">
            {hasActiveFilters() && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                Limpar Filtros
              </Button>
            )}
            <p className="text-sm text-gray-500 ml-auto">
              Mostrando {filteredMentors.length} de {mentors.length} mentor{mentors.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Lista de Mentores</CardTitle>
              <CardDescription>
                {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 'es' : ''} encontrado{filteredMentors.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMentors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FontAwesomeIcon icon={faUserCheck} className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum mentor encontrado' : 'Nenhum mentor cadastrado'}
              </h3>
              <p className="text-gray-500 text-center">
                {searchTerm 
                  ? `Não há mentores correspondentes à busca "${searchTerm}".`
                  : 'Não há mentores cadastrados no sistema.'
                }
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Área de Atuação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Qualificação</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead>Último Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMentors.map((mentor) => (
                  <TableRow 
                    key={mentor.id}
                    onClick={() => handleRowClick(mentor)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">{mentor.nome}</TableCell>
                    <TableCell>{mentor.email}</TableCell>
                    <TableCell>{mentor.telefone || '-'}</TableCell>
                    <TableCell>
                      {mentorsService.getAreaAtuacaoLabel(mentor.area_atuacao)}
                    </TableCell>
                    <TableCell>{getStatusBadge(mentor.status)}</TableCell>
                    <TableCell>
                      {mentor.protocolo_concluido ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Qualificado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                          Pendente
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(mentor.created_at)}</TableCell>
                    <TableCell>{mentor.last_login ? formatDate(mentor.last_login) : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Mentor */}
      <MentorDetailsModal
        mentorId={selectedMentorId}
        mentorName={selectedMentorName}
        isOpen={isMentorDetailsOpen}
        onClose={closeMentorDetails}
      />
    </div>
  )
}
