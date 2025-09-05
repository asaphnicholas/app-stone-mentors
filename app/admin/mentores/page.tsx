"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { WelcomeBanner } from "@/components/ui/welcome-banner"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { usersService, type User, type PendingUsersResponse } from "@/lib/services/users"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUsers, 
  faUserCheck, 
  faUserTimes, 
  faSearch, 
  faEye,
  faCheck,
  faTimes,
  faClock
} from "@fortawesome/free-solid-svg-icons"

export default function AdminMentoresPage() {
  const [pendingUsers, setPendingUsers] = useState<User[]>([])
  const [activeUsers, setActiveUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false)
  const [approvalData, setApprovalData] = useState({
    status: 'ativo' as 'ativo' | 'inativo',
    observacoes: ''
  })
  const { user } = useAuth()
  const { addToast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      
      // Load pending users
      const pendingResponse = await usersService.getPendingUsers()
      setPendingUsers(pendingResponse.usuarios)
      
      // Load active users
      const activeUsers = await usersService.getUsers({ role: 'mentor', status: 'ativo' })
      setActiveUsers(activeUsers)
      
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar usuários",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
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
      loadUsers()
      
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

  const filteredPendingUsers = pendingUsers.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredActiveUsers = activeUsers.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Mentores</h1>
            <p className="text-gray-600 mt-2">Aprove e gerencie mentores da plataforma</p>
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
    <div className="space-y-6">
      {/* <WelcomeBanner
        title="Gerenciar Mentores"
        description="Aprove e gerencie mentores da plataforma Stone Mentors"
        userName={user?.nome}
        userEmail={user?.email}
      /> */}

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
            Pendentes ({pendingUsers.length})
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUserCheck} className="h-4 w-4" />
            Ativos ({activeUsers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar mentores pendentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredPendingUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FontAwesomeIcon icon={faUsers} className="h-12 w-12 text-gray-400 mb-4" />
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
                        <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                        <span>{usersService.getStatusLabel(user.area_atuacao)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                        <span>Criado em {usersService.formatDate(user.created_at)}</span>
                      </div>
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
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar mentores ativos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredActiveUsers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FontAwesomeIcon icon={faUserCheck} className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum mentor ativo</h3>
                <p className="text-gray-500 text-center">
                  Não há mentores ativos no momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActiveUsers.map((user) => (
                <Card key={user.id} className="hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{user.nome}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </div>
                      <Badge variant="default">
                        {usersService.getStatusLabel(user.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
                        <span>{usersService.getStatusLabel(user.area_atuacao)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
                        <span>Último login: {user.last_login ? usersService.formatDate(user.last_login) : 'Nunca'}</span>
                      </div>
                      {user.total_materiais_concluidos !== undefined && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FontAwesomeIcon icon={faCheck} className="h-4 w-4" />
                          <span>{user.total_materiais_concluidos} materiais concluídos</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                      >
                        <FontAwesomeIcon icon={faEye} className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
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
    </div>
  )
}