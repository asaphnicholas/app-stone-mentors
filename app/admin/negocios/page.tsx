"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faBuilding, 
  faClock, 
  faUser, 
  faMapMarkerAlt, 
  faChevronDown, 
  faSearch, 
  faPlus,
  faUsers,
  faChartLine
} from "@fortawesome/free-solid-svg-icons"

// Mock data
const businessesWaiting = [
  {
    id: 1,
    nome: "Padaria do Bairro",
    contato: "Maria Santos",
    telefone: "(11) 99999-9999",
    segmento: "Alimentação",
    localizacao: "Centro, São Paulo",
    diasNaFila: 5,
    prioridade: "alta",
  },
  {
    id: 2,
    nome: "Tech Startup",
    contato: "João Silva",
    telefone: "(11) 88888-8888",
    segmento: "Tecnologia",
    localizacao: "Vila Madalena, São Paulo",
    diasNaFila: 2,
    prioridade: "normal",
  },
  {
    id: 3,
    nome: "Loja de Roupas Fashion",
    contato: "Ana Costa",
    telefone: "(11) 77777-7777",
    segmento: "Moda",
    localizacao: "Jardins, São Paulo",
    diasNaFila: 8,
    prioridade: "alta",
  },
]

const businessesInMentoring = [
  {
    id: 4,
    nome: "Restaurante Familiar",
    contato: "Carlos Oliveira",
    segmento: "Alimentação",
    mentor: "João Silva",
    mentorAvatar: "JS",
    progresso: 65,
    proximaSessao: "Amanhã às 14:00",
    sessoesConcluidas: 3,
    totalSessoes: 5,
  },
  {
    id: 5,
    nome: "Academia Fitness",
    contato: "Fernanda Lima",
    segmento: "Saúde",
    mentor: "Maria Santos",
    mentorAvatar: "MS",
    progresso: 30,
    proximaSessao: "Sexta às 10:00",
    sessoesConcluidas: 1,
    totalSessoes: 4,
  },
]

const availableMentors = [
  { id: 1, name: "João Silva", expertise: ["Vendas", "Marketing"] },
  { id: 2, name: "Maria Santos", expertise: ["Finanças", "Gestão"] },
  { id: 3, name: "Carlos Oliveira", expertise: ["Operações"] },
  { id: 4, name: "Ana Costa", expertise: ["RH", "Liderança"] },
]

const segmentos = ["Todos", "Alimentação", "Tecnologia", "Moda", "Saúde", "Serviços"]

export default function NegociosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSegment, setSelectedSegment] = useState("Todos")

  const filteredWaiting = businessesWaiting.filter((business) => {
    const matchesSearch = business.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = selectedSegment === "Todos" || business.segmento === selectedSegment
    return matchesSearch && matchesSegment
  })

  const filteredInMentoring = businessesInMentoring.filter((business) => {
    const matchesSearch = business.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSegment = selectedSegment === "Todos" || business.segmento === selectedSegment
    return matchesSearch && matchesSegment
  })

  const handleAssignMentor = (businessId: number, mentorId: number) => {
    console.log(`Atribuindo mentor ${mentorId} ao negócio ${businessId}`)
    // TODO: Implement mentor assignment logic
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-green-dark to-stone-green-light rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
            <FontAwesomeIcon icon={faBuilding} className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Gestão de Negócios</h1>
            <p className="text-white/90 text-lg">Gerencie a fila de espera e negócios em mentoria</p>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 backdrop-blur-sm">
            <FontAwesomeIcon icon={faPlus} className="h-5 w-5 mr-2" />
            Cadastrar Negócio
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{businessesWaiting.length}</p>
                <p className="text-sm text-gray-600">Aguardando Mentor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{businessesInMentoring.length}</p>
                <p className="text-sm text-gray-600">Em Mentoria</p>
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
                <p className="text-2xl font-bold text-gray-900">{availableMentors.length}</p>
                <p className="text-sm text-gray-600">Mentores Disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">85%</p>
                <p className="text-sm text-gray-600">Taxa de Sucesso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
              />
              <Input
                placeholder="Buscar negócios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-gray-200 focus:border-stone-green-dark transition-colors"
              />
            </div>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger className="w-full sm:w-48 border-2 border-gray-200 focus:border-stone-green-dark">
                <SelectValue placeholder="Filtrar por segmento" />
              </SelectTrigger>
              <SelectContent>
                {segmentos.map((segmento) => (
                  <SelectItem key={segmento} value={segmento}>
                    {segmento}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Business Sections */}
      <Accordion type="multiple" defaultValue={["waiting", "mentoring"]} className="space-y-6">
        {/* Waiting Queue */}
        <AccordionItem value="waiting" className="border-0">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="flex items-center gap-3 text-left text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="h-5 w-5 text-yellow-600" />
                </div>
                Aguardando Mentor ({filteredWaiting.length})
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWaiting.map((business) => (
                    <Card key={business.id} className="border-2 border-yellow-200 bg-yellow-50/50 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                            <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-yellow-600" />
                            {business.nome}
                          </CardTitle>
                          <Badge 
                            variant={business.diasNaFila > 3 ? "destructive" : "secondary"} 
                            className="text-xs font-medium"
                          >
                            {business.diasNaFila} dias
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{business.contato}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 text-gray-500" />
                            <Badge variant="outline" className="text-xs bg-white/50">
                              {business.segmento}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600">{business.localizacao}</span>
                          </div>
                        </div>

                        {business.diasNaFila > 3 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 font-medium">
                            ⚠️ Na fila há mais de 3 dias - Prioridade alta
                          </div>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="w-full bg-stone-green-light hover:bg-stone-green-dark text-white font-medium">
                              Atribuir Mentor
                              <FontAwesomeIcon icon={faChevronDown} className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            {availableMentors.map((mentor) => (
                              <DropdownMenuItem
                                key={mentor.id}
                                onClick={() => handleAssignMentor(business.id, mentor.id)}
                                className="cursor-pointer p-3"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-gray-900">{mentor.name}</span>
                                  <span className="text-xs text-gray-600">{mentor.expertise.join(", ")}</span>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* In Mentoring */}
        <AccordionItem value="mentoring" className="border-0">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <CardTitle className="flex items-center gap-3 text-left text-xl font-bold text-gray-900">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-green-600" />
                </div>
                Em Mentoria ({filteredInMentoring.length})
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredInMentoring.map((business) => (
                    <Card key={business.id} className="border-2 border-stone-green-light/30 bg-stone-green-light/5 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2 text-gray-900">
                          <FontAwesomeIcon icon={faBuilding} className="h-4 w-4 text-stone-green-light" />
                          {business.nome}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-gray-500" />
                            <span className="text-gray-700">{business.contato}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 text-gray-500" />
                            <Badge variant="outline" className="text-xs bg-white/50">
                              {business.segmento}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Mentor:</span>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 ring-2 ring-stone-green-light/20">
                                <AvatarFallback className="bg-stone-green-light text-white text-xs font-semibold">
                                  {business.mentorAvatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-gray-900">{business.mentor}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progresso:</span>
                            <span className="font-semibold text-gray-900">{business.progresso}%</span>
                          </div>
                          <Progress value={business.progresso} className="h-2 bg-gray-200" />
                          <div className="text-xs text-gray-500">
                            {business.sessoesConcluidas} de {business.totalSessoes} sessões concluídas
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faClock} className="h-3 w-3 text-blue-600" />
                            <span className="text-blue-800 font-medium">Próxima: {business.proximaSessao}</span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full bg-transparent hover:bg-gray-50 border-gray-300" size="sm">
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
