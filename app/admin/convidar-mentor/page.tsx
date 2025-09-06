"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUserPlus, 
  faEnvelope, 
  faUser, 
  faCalendarAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faPlus,
  faEye,
  faCopy
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/components/ui/toast"
import { invitesService, type Invite, type InvitesListResponse } from "@/lib/services/invites"
import { useAuth } from "@/contexts/auth-context"

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
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl p-8 text-white shadow-xl">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faUserPlus} className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">Convidar Mentor</h1>
          <p className="text-white/90 text-xl">Carregando convites...</p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

export default function ConvidarMentor() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [invites, setInvites] = useState<InvitesListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    nome: ''
  })
  const isHydrated = useHydration()

  useEffect(() => {
    if (isHydrated) {
      loadInvites()
    }
  }, [isHydrated])

  const loadInvites = async () => {
    try {
      setIsLoading(true)
      const data = await invitesService.getInvites()
      setInvites(data)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao carregar convites",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateInvite = async () => {
    if (!formData.email || !formData.nome) {
      addToast({
        type: "error",
        title: "Campos obrigatórios",
        message: "Por favor, preencha todos os campos",
      })
      return
    }

    try {
      setIsCreating(true)
      await invitesService.createInvite(formData)
      
      addToast({
        type: "success",
        title: "Convite enviado!",
        message: `Convite enviado com sucesso para ${formData.email}`,
      })
      
      setFormData({ email: '', nome: '' })
      setIsDialogOpen(false)
      loadInvites()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao enviar convite",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (invite: Invite) => {
    if (invite.usado) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 mr-1" />
          Usado
        </Badge>
      )
    }
    
    if (invite.expirado) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 mr-1" />
          Expirado
        </Badge>
      )
    }
    
    return (
      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
        <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addToast({
      type: "success",
      title: "Copiado!",
      message: "Link copiado para a área de transferência",
    })
  }

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
              <FontAwesomeIcon icon={faUserPlus} className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Convidar Mentor</h1>
              <p className="text-white/90 text-xl">Envie convites para novos mentores</p>
              <p className="text-white/80 text-base">Expanda sua rede de mentores qualificados</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm shadow-lg h-14 px-8">
                <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-3" />
                Novo Convite
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">Enviar Convite</DialogTitle>
                <DialogDescription className="text-gray-600">
                  Preencha os dados do mentor que você deseja convidar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                    Nome do Mentor
                  </Label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faUser} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                    />
                    <Input
                      id="nome"
                      type="text"
                      placeholder="Digite o nome completo"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email do Mentor
                  </Label>
                  <div className="relative">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
                    />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite o email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">O que acontece após o envio?</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Email será enviado automaticamente com link de cadastro</li>
                        <li>• Link tem validade de 7 dias</li>
                        <li>• Mentor poderá se cadastrar e ficará ativo</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateInvite}
                    disabled={isCreating}
                    className="flex-1 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg h-12"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2" />
                        Enviar Convite
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="h-12"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      {invites && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Convites</p>
                  <p className="text-3xl font-bold text-gray-900">{invites.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faEnvelope} className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-3xl font-bold text-yellow-600">{invites.pendentes}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Usados</p>
                  <p className="text-3xl font-bold text-green-600">{invites.usados}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Expirados</p>
                  <p className="text-3xl font-bold text-red-600">{invites.expirados}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Convites List */}
      {invites && (
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Convites Enviados</CardTitle>
            <CardDescription className="text-gray-600">
              Acompanhe o status de todos os convites enviados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {invites.invites.length === 0 ? (
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faEnvelope} className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum convite enviado</h3>
                <p className="text-gray-600">Comece enviando seu primeiro convite para um mentor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {invites.invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-stone-green-light/10 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-stone-green-dark" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{invite.nome}</h4>
                        <p className="text-sm text-gray-600">{invite.email}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3 mr-1" />
                            Enviado em {formatDate(invite.created_at)}
                          </span>
                          <span className="text-xs text-gray-500">
                            Expira em {formatDate(invite.expires_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(invite)}
                      
                      {!invite.usado && !invite.expirado && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(`${window.location.origin}/register?token=${invite.token}`)}
                          className="h-8"
                        >
                          <FontAwesomeIcon icon={faCopy} className="h-3 w-3 mr-1" />
                          Copiar Link
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
