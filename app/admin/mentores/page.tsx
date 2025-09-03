"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faSearch, 
  faUserPlus, 
  faEllipsisH, 
  faEnvelope, 
  faPhone,
  faUsers,
  faPlus
} from "@fortawesome/free-solid-svg-icons"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const mentores = [
  {
    id: 1,
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999",
    status: "ativo" as const,
    mentorias: 15,
    ultimoAcesso: "Hoje às 14:30",
    expertise: ["Vendas", "Marketing"],
    avatar: "JS",
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "(11) 88888-8888",
    status: "ativo" as const,
    mentorias: 8,
    ultimoAcesso: "Ontem às 16:45",
    expertise: ["Finanças", "Gestão"],
    avatar: "MS",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    email: "carlos@email.com",
    phone: "(11) 77777-7777",
    status: "pendente" as const,
    mentorias: 0,
    ultimoAcesso: "Nunca",
    expertise: ["Operações"],
    avatar: "CO",
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 66666-6666",
    status: "inativo" as const,
    mentorias: 3,
    ultimoAcesso: "Há 1 semana",
    expertise: ["RH", "Liderança"],
    avatar: "AC",
  },
]

export default function MentoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    expertise: "",
    message: "",
  })

  const filteredMentores = mentores.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleInvite = () => {
    // TODO: Implement invite logic
    console.log("Convidando mentor:", inviteForm)
    setIsInviteModalOpen(false)
    setInviteForm({ name: "", email: "", expertise: "", message: "" })
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faUsers} className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Gestão de Mentores</h1>
            <p className="text-white/90 text-lg">Gerencie e acompanhe o desempenho dos mentores da plataforma</p>
          </div>
          <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
                <FontAwesomeIcon icon={faUserPlus} className="h-5 w-5 mr-2" />
                Convidar Mentor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Convidar Novo Mentor</DialogTitle>
                <DialogDescription>Envie um convite para um novo mentor se juntar à plataforma</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Nome do mentor"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemplo.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expertise">Área de expertise</Label>
                  <Input
                    id="expertise"
                    placeholder="Ex: Vendas, Marketing, Finanças"
                    value={inviteForm.expertise}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, expertise: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem personalizada (opcional)</Label>
                  <Textarea
                    id="message"
                    placeholder="Adicione uma mensagem personalizada ao convite..."
                    value={inviteForm.message}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, message: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleInvite} className="bg-stone-green-light hover:bg-stone-green-dark">
                  Enviar Convite
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-sm text-gray-600">Total de Mentores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Mentores Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2</p>
                <p className="text-sm text-gray-600">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
              />
              <Input
                placeholder="Buscar mentores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-stone-green-dark transition-colors"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Mentor</TableHead>
                <TableHead className="font-semibold text-gray-900">Status</TableHead>
                <TableHead className="font-semibold text-gray-900">Mentorias</TableHead>
                <TableHead className="font-semibold text-gray-900">Último Acesso</TableHead>
                <TableHead className="font-semibold text-gray-900">Expertise</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMentores.map((mentor) => (
                <TableRow key={mentor.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-stone-green-light/20">
                        <AvatarFallback className="bg-stone-green-light text-white text-sm font-semibold">
                          {mentor.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{mentor.name}</p>
                        <p className="text-sm text-gray-600">{mentor.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={mentor.status} />
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-gray-900">{mentor.mentorias}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{mentor.ultimoAcesso}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {mentor.expertise.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <FontAwesomeIcon icon={faEllipsisH} className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="cursor-pointer">
                          <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2 text-blue-600" />
                          Enviar E-mail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <FontAwesomeIcon icon={faPhone} className="h-4 w-4 mr-2 text-green-600" />
                          Ligar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
