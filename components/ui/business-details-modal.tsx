"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faBuilding, 
  faUser, 
  faPhone, 
  faChartLine, 
  faUsers, 
  faUserTie, 
  faHandshake, 
  faClock, 
  faCheckCircle, 
  faExclamationTriangle, 
  faRocket, 
  faCalendarAlt, 
  faPlay, 
  faBriefcase
} from "@fortawesome/free-solid-svg-icons"
import { businessesService, type BusinessDetails } from "@/lib/services/businesses"
import { formatDateToBR } from "@/lib/utils/date"

interface BusinessDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  businessId: string
  businessName: string
}

export function BusinessDetailsModal({ 
  isOpen, 
  onClose, 
  businessId, 
  businessName 
}: BusinessDetailsModalProps) {
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Função para formatar valor em reais para exibição
  const formatCurrencyDisplay = (value: number | undefined): string => {
    if (!value) return ""
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value)
  }

  // Carregar detalhes quando a modal abrir
  const loadDetails = async () => {
    if (!businessId) return
    
    setIsLoading(true)
    try {
      const details = await businessesService.getBusinessDetails(businessId)
      setBusinessDetails(details)
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados quando a modal abrir
  useEffect(() => {
    if (isOpen && businessId) {
      loadDetails()
    }
  }, [isOpen, businessId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full max-h-[95vh] overflow-hidden bg-white p-0">
        <DialogHeader className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-stone-green-dark to-stone-green-light">
          <DialogTitle className="text-3xl font-bold text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="h-6 w-6 text-white" />
            </div>
            Detalhes do Negócio
          </DialogTitle>
          <DialogDescription className="text-white/90 text-lg">
            Informações completas sobre "{businessName}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(95vh-120px)] px-8 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-green-light border-t-transparent"></div>
                <p className="text-gray-600 font-medium">Carregando detalhes...</p>
              </div>
            </div>
          ) : businessDetails ? (
            <div className="space-y-8">
              {/* Header com informações principais - LAYOUT HORIZONTAL */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Informações Básicas */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50 xl:col-span-2">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-white" />
                      </div>
                      Informações do Negócio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <FontAwesomeIcon icon={faBuilding} className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Nome do Negócio</p>
                            <p className="font-bold text-gray-900 text-lg">{businessDetails.nome}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <FontAwesomeIcon icon={faBriefcase} className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Área de Atuação</p>
                            <Badge className="bg-blue-500 text-white font-semibold px-3 py-1">
                              {businessDetails.area_atuacao}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Empreendedor</p>
                            <p className="font-bold text-gray-900 text-lg">{businessDetails.nome_empreendedor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl">
                          <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-600">Telefone</p>
                            <p className="font-bold text-gray-900 text-lg">{businessDetails.telefone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    {businessDetails.descricao && (
                      <div className="p-4 bg-white/60 rounded-xl">
                        <p className="text-sm font-medium text-gray-600 mb-2">Descrição</p>
                        <p className="text-gray-900 leading-relaxed">{businessDetails.descricao}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status e Métricas */}
                <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
                      </div>
                      Status & Métricas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center p-4 bg-white/60 rounded-xl">
                      <p className="text-sm font-medium text-gray-600 mb-2">Status Atual</p>
                      <Badge className={`text-lg px-4 py-2 ${
                        businessDetails.status === 'ativo' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {businessDetails.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    {businessDetails.faturamento_mensal && (
                      <div className="text-center p-4 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-600">Faturamento Mensal</p>
                        <p className="text-2xl font-bold text-emerald-600">{formatCurrencyDisplay(businessDetails.faturamento_mensal)}</p>
                      </div>
                    )}
                    
                    {businessDetails.numero_funcionarios && (
                      <div className="text-center p-4 bg-white/60 rounded-xl">
                        <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-600">Funcionários</p>
                        <p className="text-2xl font-bold text-emerald-600">{businessDetails.numero_funcionarios}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Mentor Vinculado - DESTAQUE ESPECIAL */}
              {businessDetails.mentor_nome && (
                <Card className="border-0 shadow-xl bg-gradient-to-r from-stone-green-light/20 to-stone-green-dark/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faUserTie} className="h-6 w-6 text-white" />
                      </div>
                      Mentor Vinculado
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-lg">
                      <Avatar className="h-20 w-20 bg-gradient-to-br from-stone-green-light to-stone-green-dark ring-4 ring-white shadow-xl">
                        <AvatarFallback className="text-white font-bold text-2xl">
                          {businessDetails.mentor_nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{businessDetails.mentor_nome}</h3>
                        {businessDetails.mentor_email && (
                          <p className="text-gray-600 text-lg mb-1">{businessDetails.mentor_email}</p>
                        )}
                        {businessDetails.data_vinculacao_mentor && (
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-stone-green-dark" />
                            <p className="text-stone-green-dark font-medium">
                              Vinculado em {formatDateToBR(businessDetails.data_vinculacao_mentor)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Estatísticas de Mentorias - LAYOUT APRIMORADO */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon icon={faHandshake} className="h-6 w-6 text-white" />
                    </div>
                    Estatísticas de Mentorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-2xl shadow-lg">
                      <FontAwesomeIcon icon={faHandshake} className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">Total</p>
                      <p className="text-3xl font-bold">{businessDetails.total_mentorias}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-2xl shadow-lg">
                      <FontAwesomeIcon icon={faClock} className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">Disponíveis</p>
                      <p className="text-3xl font-bold">{businessDetails.mentorias_disponiveis}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl shadow-lg">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">Confirmadas</p>
                      <p className="text-3xl font-bold">{businessDetails.mentorias_confirmadas}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl shadow-lg">
                      <FontAwesomeIcon icon={faPlay} className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">Em Andamento</p>
                      <p className="text-3xl font-bold">{businessDetails.mentorias_em_andamento}</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-br from-gray-500 to-slate-500 text-white rounded-2xl shadow-lg">
                      <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 mx-auto mb-3" />
                      <p className="text-sm font-medium mb-1">Finalizadas</p>
                      <p className="text-3xl font-bold">{businessDetails.mentorias_finalizadas}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Desafios e Objetivos - LADO A LADO MELHORADO */}
              {(businessDetails.desafios_principais || businessDetails.objetivos_mentoria) && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {businessDetails.desafios_principais && (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
                          </div>
                          Desafios Principais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-white/80 rounded-xl">
                          <p className="text-gray-900 leading-relaxed text-lg">{businessDetails.desafios_principais}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {businessDetails.objetivos_mentoria && (
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon icon={faRocket} className="h-5 w-5 text-white" />
                          </div>
                          Objetivos da Mentoria
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-6 bg-white/80 rounded-xl">
                          <p className="text-gray-900 leading-relaxed text-lg">{businessDetails.objetivos_mentoria}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Histórico de Mentorias - LAYOUT TIMELINE */}
              {businessDetails.mentorias.length > 0 && (
                <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon icon={faCalendarAlt} className="h-6 w-6 text-white" />
                      </div>
                      Histórico de Mentorias ({businessDetails.mentorias.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {businessDetails.mentorias.map((mentoria, index) => (
                        <div key={mentoria.id} className="relative">
                          {/* Timeline line */}
                          {index < businessDetails.mentorias.length - 1 && (
                            <div className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-indigo-300 to-purple-300"></div>
                          )}
                          
                          <div className="flex items-start gap-4">
                            {/* Timeline dot */}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10 ${
                              mentoria.status === 'finalizada' 
                                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                : mentoria.status === 'em_andamento' || mentoria.status === 'andamento'
                                ? 'bg-gradient-to-br from-orange-500 to-red-500'
                                : mentoria.status === 'confirmada'
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-500'
                                : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                            }`}>
                              <FontAwesomeIcon 
                                icon={
                                  mentoria.status === 'finalizada' ? faCheckCircle :
                                  mentoria.status === 'em_andamento' || mentoria.status === 'andamento' ? faPlay :
                                  mentoria.status === 'confirmada' ? faCalendarAlt :
                                  faClock
                                } 
                                className="h-5 w-5 text-white" 
                              />
                            </div>
                            
                            {/* Mentoria card */}
                            <div className="flex-1 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <Badge className={`text-sm px-3 py-1 ${
                                    mentoria.tipo === 'primeira' 
                                      ? 'bg-blue-500 text-white' 
                                      : 'bg-green-500 text-white'
                                  }`}>
                                    {mentoria.tipo === 'primeira' ? '🎯 Primeira Mentoria' : '🔄 Follow-up'}
                                  </Badge>
                                  <Badge className={`text-sm px-3 py-1 ${
                                    mentoria.status === 'disponivel' 
                                      ? 'bg-yellow-500 text-white'
                                      : mentoria.status === 'confirmada'
                                      ? 'bg-blue-500 text-white'
                                      : mentoria.status === 'em_andamento' || mentoria.status === 'andamento'
                                      ? 'bg-orange-500 text-white'
                                      : 'bg-green-500 text-white'
                                  }`}>
                                    {mentoria.status === 'disponivel' ? '⏳ Disponível' :
                                    mentoria.status === 'confirmada' ? '✅ Confirmada' :
                                    mentoria.status === 'em_andamento' || mentoria.status === 'andamento' ? '🔥 Em Andamento' :
                                    '🏆 Finalizada'}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faCalendarAlt} className="h-4 w-4 text-indigo-500" />
                                  <span className="font-medium">{formatDateToBR(mentoria.data_agendada.split('T')[0])}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-indigo-500" />
                                  <span className="font-medium">{mentoria.data_agendada.split('T')[1]?.substring(0, 5)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <FontAwesomeIcon icon={faClock} className="h-4 w-4 text-indigo-500" />
                                  <span className="font-medium">{mentoria.duracao_minutos} minutos</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </div>
        
        {/* Footer fixo */}
        <div className="px-8 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white"
            >
              Fechar Detalhes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
