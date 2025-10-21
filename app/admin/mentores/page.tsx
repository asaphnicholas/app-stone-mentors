"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MentorDetailsModal } from "@/components/ui/mentor-details-modal"
import { ExportReportsModal } from "@/components/ui/export-reports-modal"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import ClientOnly from "@/components/ClientOnly"
import { usersService, type User } from "@/lib/services/users"
import { mentorsService, type Mentor } from "@/lib/services/mentors"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUserCheck, 
  faSearch, 
  faEye,
  faCheck,
  faTimes,
  faClock,
  faChartLine,
  faFileAlt,
  faHandshake,
  faUserGraduate,
  faBuilding,
  faPhone,
  faClipboardList,
  faAward,
  faUserFriends,
  faUserSlash,
  faTrashAlt,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons"

export default function AdminMentoresPage() {
  // Estados básicos
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [mentorsWithMentorias, setMentorsWithMentorias] = useState<Mentor[]>([])
  const [mentorsWithoutMentorias, setMentorsWithoutMentorias] = useState<Mentor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeSection, setActiveSection] = useState<'pending' | 'active' | 'performance' | 'reports'>('pending')
  
  // Estados para filtros de status
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  
  // Estados para filtros adicionais
  const [totalMentors, setTotalMentors] = useState(0)
  const [areaFilter, setAreaFilter] = useState<string>('todas')
  const [protocoloFilter, setProtocoloFilter] = useState<string>('todos')
  const [termoFilter, setTermoFilter] = useState<string>('todos')
  
  // Estados para mudança de status
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  
  // Estados para estatísticas
  const [mentorStats, setMentorStats] = useState({
    total: 0,
    ativos: 0,
    nao_qualificados: 0,
    qualificados: 0,
    ocupados: 0,
    indisponiveis: 0
  })
  
  // Estados para aprovação
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalData, setApprovalData] = useState({
    status: 'ativo' as 'ativo' | 'inativo',
    observacoes: ''
  })

  // Estados para modal de detalhes do mentor
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null)
  const [selectedMentorName, setSelectedMentorName] = useState<string>("")
  const [isMentorDetailsOpen, setIsMentorDetailsOpen] = useState(false)

  // Estado para modal de relatórios
  const [isExportReportsOpen, setIsExportReportsOpen] = useState(false)

  // Estados para ações do mentor
  const [selectedMentorForAction, setSelectedMentorForAction] = useState<Mentor | null>(null)
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [actionReason, setActionReason] = useState("")
  const [forceDelete, setForceDelete] = useState(false)
  
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  // Carregar mentores quando filtros mudarem
  useEffect(() => {
    if (activeSection === 'active') {
      loadMentorsByStatus(statusFilter)
    }
  }, [statusFilter, activeSection, areaFilter, protocoloFilter, termoFilter, searchTerm])

  const loadData = async () => {
    try {
      setIsLoading(true)
      
      // Load pending users using the new API
      const pendingResponse = await fetch('/api/admin/users?role=mentor&status=pendente', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })
      
      if (pendingResponse.ok) {
        const data = await pendingResponse.json()
        // A API retorna um array direto, não um objeto
        if (Array.isArray(data)) {
          setPendingUsers(data)
        } else {
          setPendingUsers(data.mentors || data.usuarios || data.data || [])
        }
      }
      
      // Load mentores com filtro de status
      await loadMentorsByStatus(statusFilter)
      
      // Load mentor statistics
      await loadMentorStats()
      
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

  const loadMentorsByStatus = async (status: string) => {
    try {
      setIsLoading(true)
      let users: User[] = []
      let total = 0
      
      if (status === 'todos') {
        // 1. Listar Todos os Mentores (sem filtros por padrão)
        const queryParams = new URLSearchParams()
        queryParams.append('role', 'mentor')
        queryParams.append('limit', '0')
        
        // Aplicar filtros apenas se explicitamente selecionados
        if (protocoloFilter === 'true') {
          // Usa o novo parâmetro qualificado=true que retorna todos os mentores qualificados
          queryParams.append('qualificado', 'true')
          queryParams.append('protocolo_concluido', 'true')
        } else if (protocoloFilter === 'false') {
          // Mentores não qualificados
          queryParams.append('protocolo_concluido', 'false')
        }
        
        // Adicionar filtros adicionais se selecionados
        if (areaFilter && areaFilter !== 'todas') queryParams.append('area_atuacao', areaFilter)
        if (termoFilter && termoFilter !== 'todos') queryParams.append('termo_aceite', termoFilter)
        if (searchTerm) queryParams.append('search', searchTerm)
        
        const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // A API retorna um array direto, não um objeto
          if (Array.isArray(data)) {
            users = data
            total = data.length
          } else {
            users = data.mentors || data.usuarios || data.data || []
            total = data.total_count || data.total || users.length
          }
        }
      } else if (status === 'pendente') {
        // 4. Mentores Pendentes de Aprovação
        const queryParams = new URLSearchParams()
        queryParams.append('role', 'mentor')
        queryParams.append('status', 'pendente')
        queryParams.append('limit', '0')
        
        // Adicionar filtros adicionais se selecionados
        if (areaFilter && areaFilter !== 'todas') queryParams.append('area_atuacao', areaFilter)
        if (protocoloFilter && protocoloFilter !== 'todos') queryParams.append('protocolo_concluido', protocoloFilter)
        if (termoFilter && termoFilter !== 'todos') queryParams.append('termo_aceite', termoFilter)
        if (searchTerm) queryParams.append('search', searchTerm)
        
        const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // A API retorna um array direto, não um objeto
          if (Array.isArray(data)) {
            users = data
            total = data.length
          } else {
            users = data.mentors || data.usuarios || data.data || []
            total = data.total_count || data.total || users.length
          }
        }
      } else {
        // Carregar por status específico usando a nova API
        const queryParams = new URLSearchParams()
        queryParams.append('role', 'mentor')
        queryParams.append('limit', '0')
        
        // NOVA LÓGICA: Para status específico com filtro de qualificação
        if (protocoloFilter === 'true') {
          // Usa o novo parâmetro qualificado=true que retorna todos os mentores qualificados
          queryParams.append('qualificado', 'true')
          queryParams.append('protocolo_concluido', 'true')
          // Se tem filtro de status específico, adicionar também
          if (status !== 'todos') {
            queryParams.append('status', status)
          }
        } else {
          // Lógica antiga: filtrar apenas por status
          queryParams.append('status', status)
          
          // Adicionar filtro de protocolo se necessário
          if (protocoloFilter === 'false') {
            queryParams.append('protocolo_concluido', 'false')
          }
        }
        
        // Adicionar filtros adicionais se selecionados
        if (areaFilter && areaFilter !== 'todas') queryParams.append('area_atuacao', areaFilter)
        if (termoFilter && termoFilter !== 'todos') queryParams.append('termo_aceite', termoFilter)
        if (searchTerm) queryParams.append('search', searchTerm)
        
        const response = await fetch(`/api/admin/users?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          // A API retorna um array direto, não um objeto
          if (Array.isArray(data)) {
            users = data
            total = data.length
          } else {
            users = data.mentors || data.usuarios || data.data || []
            total = data.total_count || data.total || users.length
          }
        }
      }
      
      // Converter users para mentores básicos
      const basicMentors: (Mentor & { status?: string })[] = users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone || '',
        area_atuacao: user.area_atuacao,
        area_formacao: user.area_atuacao, // Fallback
        competencias: user.competencias || '',
        protocolo_concluido: user.protocolo_concluido,
        mentorias_ativas: 0, // Será carregado sob demanda
        total_mentorias: 0, // Será carregado sob demanda
        negocios_vinculados: 0, // Será carregado sob demanda
        nps_medio: 0, // Será carregado sob demanda
        created_at: user.created_at,
        last_login: user.last_login,
        status: user.status // Adicionar status do usuário
      }))
      
      setFilteredMentors(basicMentors)
      setMentorsWithMentorias(basicMentors)
      setMentorsWithoutMentorias([])
      setTotalMentors(total)
      
      // Scroll para o topo da lista ao carregar novos dados
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
    } catch (error) {
      console.error('Erro ao carregar mentores por status:', error)
      addToast({
        type: "error",
        title: "Erro ao carregar mentores",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadMentorStats = async () => {
    try {
      // Primeiro tenta usar a API específica de estatísticas
      const response = await fetch('/api/admin/mentors/status/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMentorStats(data)
      } else {
        // Fallback: usa a API de usuários para obter status_summary
        const usersResponse = await fetch('/api/admin/users?role=mentor', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })

        if (usersResponse.ok) {
          const data = await usersResponse.json()
          if (data.status_summary) {
            setMentorStats(data.status_summary)
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas dos mentores:', error)
    }
  }

  const updateMentorStatus = async (mentorId: string, newStatus: string) => {
    try {
      setUpdatingStatus(mentorId)
      
      // Mapear status para formato da API
      const statusMapping: { [key: string]: string } = {
        'PENDENTE': 'pendente',
        'INATIVO': 'inativo', 
        'NAO_QUALIFICADO': 'nao_qualificado',
        'QUALIFICADO': 'qualificado',
        'OCUPADO': 'ocupado',
        'INDISPONIVEL': 'indisponivel'
      }
      
      const apiStatus = statusMapping[newStatus] || newStatus.toLowerCase()
      
      const response = await fetch(`/api/admin/mentors/status/${mentorId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ 
          new_status: apiStatus,
          reason: `Status alterado para ${newStatus.toLowerCase()} pelo admin`
        }),
      })

      if (response.ok) {
        addToast({
          type: "success",
          title: "Status atualizado",
          message: "O status do mentor foi atualizado com sucesso.",
        })
        
        // Recarregar dados
        await loadMentorsByStatus(statusFilter)
        await loadMentorStats()
      } else {
        const errorData = await response.json().catch(() => null)
        addToast({
          type: "error",
          title: "Erro ao atualizar status",
          message: errorData?.message || "Erro interno do servidor",
        })
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao atualizar status",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleApproveUser = async () => {
    if (!selectedUser) return

    try {
      await usersService.approveUser(selectedUser.id, approvalData)
      
      addToast({
        type: "success",
        title: "Usuário processado com sucesso!",
        message: `Usuário ${selectedUser.nome} foi ${approvalData.status === 'ativo' ? 'aprovado' : 'rejeitado'}.`,
      })

      setIsApprovalDialogOpen(false)
      setSelectedUser(null)
      setApprovalData({ status: 'ativo', observacoes: '' })
      loadData()
      
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao processar usuário",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  const openApprovalDialog = (user: User, status: 'ativo' | 'inativo') => {
    setSelectedUser(user)
    setApprovalData({ status, observacoes: '' })
    setIsApprovalDialogOpen(true)
  }

  // Função para abrir modal de detalhes do mentor
  const openMentorDetails = (mentorId: string, mentorName: string) => {
    setSelectedMentorId(mentorId)
    setSelectedMentorName(mentorName)
    setIsMentorDetailsOpen(true)
  }

  // Função para fechar modal de detalhes do mentor
  const closeMentorDetails = () => {
    setSelectedMentorId(null)
    setSelectedMentorName("")
    setIsMentorDetailsOpen(false)
  }

  // Funções para ações do mentor
  const openDeactivateDialog = (mentor: Mentor) => {
    setSelectedMentorForAction(mentor)
    setActionReason("")
    setIsDeactivateDialogOpen(true)
  }

  const openDeleteDialog = (mentor: Mentor) => {
    setSelectedMentorForAction(mentor)
    setActionReason("")
    setForceDelete(false)
    setIsDeleteDialogOpen(true)
  }

  const closeActionDialogs = () => {
    setSelectedMentorForAction(null)
    setActionReason("")
    setForceDelete(false)
    setIsDeactivateDialogOpen(false)
    setIsDeleteDialogOpen(false)
  }

  const handleDeactivateMentor = async () => {
    if (!selectedMentorForAction) return

    try {
      setIsLoading(true)
      await mentorsService.deactivateMentor(selectedMentorForAction.id, actionReason)
      
      addToast({
        type: "success",
        title: "Mentor desativado",
        message: `${selectedMentorForAction.nome} foi desativado com sucesso.`,
      })
      
      // Recarregar dados
      loadData()
      closeActionDialogs()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao desativar mentor",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivateMentor = async (mentor: Mentor) => {
    try {
      setIsLoading(true)
      await mentorsService.activateMentor(mentor.id)
      
      addToast({
        type: "success",
        title: "Mentor ativado",
        message: `${mentor.nome} foi ativado com sucesso.`,
      })
      
      // Recarregar dados
      loadData()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao ativar mentor",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMentor = async () => {
    if (!selectedMentorForAction) return

    try {
      setIsLoading(true)
      await mentorsService.deleteMentor(selectedMentorForAction.id, actionReason, forceDelete)
      
      addToast({
        type: "success",
        title: "Mentor deletado",
        message: `${selectedMentorForAction.nome} foi deletado permanentemente.`,
      })
      
      // Recarregar dados
      loadData()
      closeActionDialogs()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao deletar mentor",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }


  // Função para obter cores do status
  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'inativo':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'habilitado':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'Ativo'
      case 'inativo':
        return 'Inativo'
      case 'habilitado':
        return 'Habilitado'
      default:
        return status
    }
  }

  // Filtros
  const filteredPendingUsers = pendingUsers.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMentorsWithMentorias = mentorsWithMentorias.filter(mentor =>
    mentor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredMentorsWithoutMentorias = mentorsWithoutMentorias.filter(mentor =>
    mentor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Aplicar filtro de busca nos mentores filtrados por status
  const filteredMentorsBySearch = filteredMentors.filter(mentor =>
    mentor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  )


  // Render mentor card
  const renderMentorCard = (mentor: Mentor & { status?: string }) => {
    // Usar o status real do mentor da API
    const mentorStatus = mentor.status?.toLowerCase() || 'ativo'
    
    // Determinar cor da borda baseado na qualificação
    const borderColor = mentor.protocolo_concluido 
      ? 'border-green-300' 
      : 'border-amber-300'
    
    return (
      <Card key={mentor.id} className={`hover:shadow-md transition-all duration-200 border-2 ${borderColor}`}>
        <CardHeader>
          <div className="space-y-3">
          <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{mentor.nome}</CardTitle>
                <CardDescription className="truncate">{mentor.email}</CardDescription>
            </div>
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={`border ${getStatusColors(mentorStatus)}`}>
                  {getStatusText(mentorStatus)}
                </Badge>
                {mentor.protocolo_concluido && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Qualificado
                  </Badge>
                )}
              </div>
              
              {/* Select para alterar status */}
              <div className="flex items-center gap-2">
                <Label htmlFor={`status-${mentor.id}`} className="text-xs font-medium text-gray-600">
                  Alterar Status:
                </Label>
                <Select 
                  value={mentorStatus} 
                  onValueChange={(value) => updateMentorStatus(mentor.id, value)}
                  disabled={updatingStatus === mentor.id}
                >
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDENTE">Pendente</SelectItem>
                    <SelectItem value="INATIVO">Inativo</SelectItem>
                    <SelectItem value="NAO_QUALIFICADO">Não Qualificado</SelectItem>
                    <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
                    <SelectItem value="OCUPADO">Ocupado</SelectItem>
                    <SelectItem value="INDISPONIVEL">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
                {updatingStatus === mentor.id && (
                  <div className="w-4 h-4 border-2 border-stone-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
              <span>{mentorsService.getAreaAtuacaoLabel(mentor.area_atuacao)}</span>
            </div>
            {mentor.telefone && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                <span>{mentor.telefone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
              <span>Cadastrado em {usersService.formatDate(mentor.created_at)}</span>
            </div>
            {mentor.last_login && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FontAwesomeIcon icon={faUserCheck} className="h-4 w-4" />
                <span>Último login: {usersService.formatDate(mentor.last_login)}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => openMentorDetails(mentor.id, mentor.nome)}
              >
                <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                Ver Detalhes
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => openMentorDetails(mentor.id, mentor.nome)}
              >
                <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 mr-1" />
                Performance
              </Button>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => openDeleteDialog(mentor)}
            >
              <FontAwesomeIcon icon={faTrashAlt} className="h-3 w-3 mr-1" />
              Deletar
            </Button>
          </div>
        </CardContent>
      </Card>
    )
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Mentores</h1>
          <p className="text-gray-600 mt-2">Gerencie mentores, aprove cadastros e monitore performance</p>
        </div>
        <Button 
          className="border-2 border-gray-300"
          onClick={() => setIsExportReportsOpen(true)}
        >
          <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
          Gerar Relatório
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2  pb-4">
        <Button
          variant={activeSection === 'pending' ? 'default' : 'outline'}
          onClick={() => setActiveSection('pending')}
          className="flex items-center gap-2"
        >
            <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
            Pendentes ({pendingUsers.length})
        </Button>
        <Button
          variant={activeSection === 'active' ? 'default' : 'outline'}
          onClick={() => setActiveSection('active')}
          className="flex items-center gap-2"
        >
            <FontAwesomeIcon icon={faUserCheck} className="h-4 w-4" />
          Mentores ({mentorsWithMentorias.length + mentorsWithoutMentorias.length})
        </Button>
        <Button
          variant={activeSection === 'performance' ? 'default' : 'outline'}
          onClick={() => setActiveSection('performance')}
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
          Performance
        </Button>
        {/* <Button
          variant={activeSection === 'reports' ? 'default' : 'outline'}
          onClick={() => setActiveSection('reports')}
          className="flex items-center gap-2"
        >
          <FontAwesomeIcon icon={faClipboardList} className="h-4 w-4" />
          Relatórios
        </Button> */}
      </div>

      {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
            placeholder="Buscar mentores por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

      {/* Seção de Mentores Pendentes */}
      {activeSection === 'pending' && (
        <div className="space-y-6">
          {filteredPendingUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 border-2 border-gray-200">
                <FontAwesomeIcon icon={faClock} className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum mentor pendente</h3>
                <p className="text-gray-500 text-center">
                  Não há mentores aguardando aprovação no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPendingUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.nome}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {usersService.getStatusLabel(user.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" />
                        <span>{mentorsService.getAreaAtuacaoLabel(user.area_atuacao)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                        <span>Criado em {usersService.formatDate(user.created_at)}</span>
                      </div>
                      {user.telefone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FontAwesomeIcon icon={faPhone} className="h-4 w-4" />
                          <span>{user.telefone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => openApprovalDialog(user, 'ativo')}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={faCheck} className="h-3 w-3 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openApprovalDialog(user, 'inativo')}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <FontAwesomeIcon icon={faTimes} className="h-3 w-3 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Seção de Mentores Ativos */}
      {activeSection === 'active' && (
        <ClientOnly>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Mentores ({filteredMentorsBySearch.length})
              </h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-green-300 rounded"></div>
                  <span className="text-sm text-gray-600">Qualificado (Protocolo concluído)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border-2 border-amber-300 rounded"></div>
                  <span className="text-sm text-gray-600">Não Qualificado (Aguardando protocolo)</span>
                </div>
              </div>
              {protocoloFilter === 'true' && (
                <div className="mt-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Modo Qualificados:</strong> Mostrando todos os mentores com protocolo concluído (independente do status: ativos + ocupados)
                  </p>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {searchTerm ? `Mostrando resultados para "${searchTerm}"` : protocoloFilter === 'true' ? `Qualificados: ${totalMentors} mentor(es)` : 'Filtrados por status'}
            </div>
          </div>

          {/* Filtros de Status */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="status-filter" className="text-sm font-medium">
                Status:
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Mentores</SelectItem>
                  <SelectItem value="pendente">Pendentes de Aprovação</SelectItem>
                  <SelectItem value="ativo">Mentores Ativos</SelectItem>
                  <SelectItem value="ocupado">Mentores Ocupados</SelectItem>
                  <SelectItem value="indisponivel">Indisponíveis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="area-filter" className="text-sm font-medium">
                Área:
              </Label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas as áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as áreas</SelectItem>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={String(area.value)} value={String(area.value)}>
                      {String(area.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="protocolo-filter" className="text-sm font-medium">
                Qualificação:
              </Label>
              <Select value={protocoloFilter} onValueChange={setProtocoloFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todas as qualificações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas as Qualificações</SelectItem>
                  <SelectItem value="true">Qualificados</SelectItem>
                  <SelectItem value="false">Não Qualificados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="termo-filter" className="text-sm font-medium">
                Termo:
              </Label>
              <Select value={termoFilter} onValueChange={setTermoFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="true">Aceito</SelectItem>
                  <SelectItem value="false">Não aceito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botão Limpar Filtros */}
            {(statusFilter !== 'todos' || areaFilter !== 'todas' || protocoloFilter !== 'todos' || termoFilter !== 'todos' || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("todos")
                  setAreaFilter("todas")
                  setProtocoloFilter("todos")
                  setTermoFilter("todos")
                }}
                className="ml-auto"
              >
                <FontAwesomeIcon icon={faTimes} className="h-3 w-3 mr-2" />
                Limpar Filtros
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
                <p className="text-gray-500">Carregando mentores...</p>
              </div>
            </div>
          ) : filteredMentorsBySearch.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FontAwesomeIcon icon={faUserCheck} className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum mentor encontrado' : 'Nenhum mentor encontrado'}
                </h3>
                <p className="text-gray-500 text-center">
                  {searchTerm 
                    ? `Não há mentores correspondentes à busca "${searchTerm}".`
                    : `Não há mentores com status "${statusFilter}".`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMentorsBySearch.map(renderMentorCard)}
            </div>
          )}
        </div>
        </ClientOnly>
      )}

      {/* Seção de Performance */}
      {activeSection === 'performance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total de Mentores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {mentorStats.total}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Total de mentores cadastrados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Mentores Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {mentorStats.ativos}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Já foram aceitos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Não Qualificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {mentorStats.nao_qualificados}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ativos sem trilha de formação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Qualificados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {mentorStats.qualificados}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ativos e qualificados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Ocupados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {mentorStats.ocupados}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Com negócio vinculado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Indisponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {mentorStats.indisponiveis}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Não podem fazer mentorias
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
                  <CardHeader>
              <CardTitle>Status dos Mentores</CardTitle>
              <CardDescription>
                Visão geral dos mentores por status. Clique em "Mentores Ativos" para gerenciar individualmente.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <FontAwesomeIcon icon={faChartLine} className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium mb-2">Gestão de Status</p>
                <p className="text-sm">
                  Os status dos mentores podem ser alterados manualmente pelo admin.
                  <br />
                  Use a seção "Mentores Ativos" para gerenciar status individuais.
                </p>
                      </div>
            </CardContent>
          </Card>
                    </div>
      )}

      {/* Seção de Relatórios */}
      {activeSection === 'reports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerar Relatório de Mentorias</CardTitle>
              <CardDescription>Configure os filtros para gerar relatórios personalizados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                  <Label>Mentor Específico (opcional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos os mentores</SelectItem>
                      {[...mentorsWithMentorias, ...mentorsWithoutMentorias].map(mentor => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                      </div>

                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input type="date" />
                      </div>

                <div className="space-y-2">
                  <Label>Data de Fim</Label>
                  <Input type="date" />
                        </div>
                    </div>

              <div className="flex justify-end">
                <Button className="bg-stone-600 hover:bg-stone-700">
                  <FontAwesomeIcon icon={faFileAlt} className="h-4 w-4 mr-2" />
                  Gerar Relatório
                      </Button>
                    </div>
                  </CardContent>
                </Card>
            </div>
          )}

      {/* Modal de Aprovação */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>
              {approvalData.status === 'ativo' ? 'Aprovar Mentor' : 'Rejeitar Mentor'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  {approvalData.status === 'ativo' 
                    ? `Aprovar ${selectedUser.nome} como mentor?` 
                    : `Rejeitar ${selectedUser.nome}?`
                  }
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={approvalData.observacoes}
                onChange={(e) => setApprovalData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Adicione observações sobre a decisão..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsApprovalDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleApproveUser}
                className={approvalData.status === 'ativo' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
                }
              >
                {approvalData.status === 'ativo' ? 'Aprovar' : 'Rejeitar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Mentor */}
      <MentorDetailsModal
        mentorId={selectedMentorId}
        mentorName={selectedMentorName}
        isOpen={isMentorDetailsOpen}
        onClose={closeMentorDetails}
      />

      {/* Modal de Exportação de Relatórios */}
      <ExportReportsModal
        isOpen={isExportReportsOpen}
        onClose={() => setIsExportReportsOpen(false)}
      />

      {/* Modal de Desativação */}
      <Dialog open={isDeactivateDialogOpen} onOpenChange={closeActionDialogs}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserSlash} className="h-5 w-5 text-red-600" />
              Desativar Mentor
            </DialogTitle>
            <DialogDescription>
              Esta ação irá desativar o mentor {selectedMentorForAction?.nome}. Ele não poderá acessar o sistema até ser reativado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="deactivate-reason pb-2">Motivo (opcional)</Label>
              <Textarea
                id="deactivate-reason"
                placeholder="Descreva o motivo da desativação..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={closeActionDialogs}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeactivateMentor}
                className="bg-red-600 hover:bg-red-700"
              >
                <FontAwesomeIcon icon={faUserSlash} className="h-4 w-4 mr-2" />
                Desativar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Deleção */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={closeActionDialogs}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-red-600" />
              Deletar Mentor
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-2">
                <p>Esta ação é <strong>irreversível</strong> e irá deletar permanentemente:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Conta do mentor {selectedMentorForAction?.nome}</li>
                  <li>Todas as informações pessoais</li>
                  <li>Histórico de mentorias</li>
                  <li>Vínculos com negócios</li>
                </ul>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="delete-reason">Motivo da deleção *</Label>
              <Textarea
                id="delete-reason"
                placeholder="Descreva o motivo da deleção..."
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-delete"
                  checked={forceDelete}
                  onChange={(e) => setForceDelete(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <Label htmlFor="force-delete" className="text-sm font-medium">
                  Forçar deleção mesmo com dados vinculados
                </Label>
              </div>
              <div className="ml-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-xs text-yellow-800">
                  <strong>Atenção:</strong> Marque esta opção se o mentor possui materiais de treinamento ou negócios vinculados. 
                  Esta ação irá cancelar todas as mentorias ativas e desvincular os negócios associados ao mentor.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={closeActionDialogs}>
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteMentor}
                disabled={!actionReason.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faTrashAlt} className="h-4 w-4 mr-2" />
                Deletar Permanentemente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
