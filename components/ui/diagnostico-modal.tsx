"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUser,
  faEnvelope,
  faPhone,
  faBuilding,
  faClock,
  faChartLine,
  faUsers,
  faExclamationTriangle,
  faBrain,
  faLightbulb,
  faCheckCircle,
  faTimes,
  faSave,
  faEdit
} from "@fortawesome/free-solid-svg-icons"
import { useToast } from "@/components/ui/toast"
import { mentoriasService } from "@/lib/services/mentorias"

interface DiagnosticoData {
  // ===== 1. IDENTIFICAÇÃO =====
  nome_completo: string
  email: string
  telefone_whatsapp: string
  status_negocio: string
  tempo_funcionamento: string
  setor_atuacao: string
  
  // ===== 2. MATURIDADE NAS ÁREAS DO NEGÓCIO (1-5) =====
  controle_financeiro: number
  divulgacao_marketing: number
  atrair_clientes_vender: number
  atender_clientes: number
  ferramentas_gestao: number
  organizacao_negocio: number
  obrigacoes_legais_juridicas: number
  
  // ===== 3. DOR PRINCIPAL DO MOMENTO =====
  dor_principal: string
  falta_caixa_financiamento: string
  dificuldade_funcionarios: string
  clientes_reclamando: string
  relacionamento_fornecedores: string
  
  // ===== 4. PSICOMÉTRICO =====
  perfil_investimento: string
  motivo_desistencia: string
  
  // ===== 5. TESTE DE PERSONALIDADE (1-4) =====
  agir_primeiro_consequencias_depois: number
  pensar_varias_solucoes: number
  seguir_primeiro_pressentimento: number
  fazer_coisas_antes_prazo: number
  fracasso_nao_opcao: number
  decisao_negocio_correta: number
  focar_oportunidades_riscos: number
  acreditar_sucesso: number
}

interface DiagnosticoModalProps {
  mentoriaId: string
  negocioNome: string
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function DiagnosticoModal({ 
  mentoriaId, 
  negocioNome, 
  isOpen, 
  onClose, 
  onSuccess 
}: DiagnosticoModalProps) {
  const [formData, setFormData] = useState<DiagnosticoData>({
    // ===== 1. IDENTIFICAÇÃO =====
    nome_completo: '',
    email: '',
    telefone_whatsapp: '',
    status_negocio: '',
    tempo_funcionamento: '',
    setor_atuacao: '',
    
    // ===== 2. MATURIDADE NAS ÁREAS DO NEGÓCIO (1-5) =====
    controle_financeiro: 1,
    divulgacao_marketing: 1,
    atrair_clientes_vender: 1,
    atender_clientes: 1,
    ferramentas_gestao: 1,
    organizacao_negocio: 1,
    obrigacoes_legais_juridicas: 1,
    
    // ===== 3. DOR PRINCIPAL DO MOMENTO =====
    dor_principal: '',
    falta_caixa_financiamento: '',
    dificuldade_funcionarios: '',
    clientes_reclamando: '',
    relacionamento_fornecedores: '',
    
    // ===== 4. PSICOMÉTRICO =====
    perfil_investimento: '',
    motivo_desistencia: '',
    
    // ===== 5. TESTE DE PERSONALIDADE (1-4) =====
    agir_primeiro_consequencias_depois: 1,
    pensar_varias_solucoes: 1,
    seguir_primeiro_pressentimento: 1,
    fazer_coisas_antes_prazo: 1,
    fracasso_nao_opcao: 1,
    decisao_negocio_correta: 1,
    focar_oportunidades_riscos: 1,
    acreditar_sucesso: 1
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { addToast } = useToast()

  const totalSteps = 5

  // Função para aplicar máscara de telefone brasileiro
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  const handleInputChange = (field: keyof DiagnosticoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSliderChange = (field: keyof DiagnosticoData, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      await mentoriasService.updateDiagnostico(mentoriaId, formData)
      
      addToast({
        type: "success",
        title: "Diagnóstico salvo com sucesso!",
        message: "O diagnóstico foi registrado para esta mentoria.",
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar diagnóstico",
        message: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Identificação do Empreendedor"
      case 2: return "Avaliação de Maturidade"
      case 3: return "Dor Principal do Momento"
      case 4: return "Teste Psicométrico"
      case 5: return "Perfil de Personalidade"
      default: return ""
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Identificação do Empreendedor</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="nome_completo" className="text-sm font-medium text-gray-700">
              Nome Completo *
            </Label>
            <Input
              id="nome_completo"
              value={formData.nome_completo}
              onChange={(e) => handleInputChange('nome_completo', e.target.value)}
              placeholder="Nome completo do empreendedor"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@exemplo.com"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="telefone_whatsapp" className="text-sm font-medium text-gray-700">
              Telefone WhatsApp *
            </Label>
            <Input
              id="telefone_whatsapp"
              value={formData.telefone_whatsapp}
              onChange={(e) => handleInputChange('telefone_whatsapp', formatPhoneNumber(e.target.value))}
              placeholder="(11) 99999-9999"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status_negocio" className="text-sm font-medium text-gray-700">
              Status do Negócio *
            </Label>
            <Select value={formData.status_negocio} onValueChange={(value) => handleInputChange('status_negocio', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Já possuo">Já possuo um negócio</SelectItem>
                <SelectItem value="Estou planejando iniciar um">Estou planejando iniciar um negócio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tempo_funcionamento" className="text-sm font-medium text-gray-700">
              Tempo de Funcionamento *
            </Label>
            <Select value={formData.tempo_funcionamento} onValueChange={(value) => handleInputChange('tempo_funcionamento', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione o tempo de funcionamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menos de 6 meses">Menos de 6 meses</SelectItem>
                <SelectItem value="De 6 meses a 1 ano">De 6 meses a 1 ano</SelectItem>
                <SelectItem value="De 1 a 3 anos">De 1 a 3 anos</SelectItem>
                <SelectItem value="De 3 a 5 anos">De 3 a 5 anos</SelectItem>
                <SelectItem value="Mais de 5 anos">Mais de 5 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setor_atuacao" className="text-sm font-medium text-gray-700">
              Setor de Atuação *
            </Label>
            <Select value={formData.setor_atuacao} onValueChange={(value) => handleInputChange('setor_atuacao', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione o setor de atuação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tecnologia e Comunicação">Tecnologia e Comunicação</SelectItem>
                <SelectItem value="Varejo e Comércio">Varejo e Comércio</SelectItem>
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Indústria e Manufatura">Indústria e Manufatura</SelectItem>
                <SelectItem value="Saúde e Bem-estar">Saúde e Bem-estar</SelectItem>
                <SelectItem value="Educação">Educação</SelectItem>
                <SelectItem value="Alimentação e Bebidas">Alimentação e Bebidas</SelectItem>
                <SelectItem value="Construção e Imóveis">Construção e Imóveis</SelectItem>
                <SelectItem value="Transporte e Logística">Transporte e Logística</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Avaliação de Maturidade</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Avalie cada aspecto de 1 (muito baixo) a 5 (muito alto):
        </p>
        
        <div className="space-y-6">
          {[
            { key: 'controle_financeiro', label: 'Controle Financeiro e Despesas' },
            { key: 'divulgacao_marketing', label: 'Divulgação do Negócio' },
            { key: 'atrair_clientes_vender', label: 'Atrair Clientes e Vender' },
            { key: 'atender_clientes', label: 'Atendimento aos Clientes' },
            { key: 'ferramentas_gestao', label: 'Uso de Ferramentas de Gestão' },
            { key: 'organizacao_negocio', label: 'Organização do Negócio' },
            { key: 'obrigacoes_legais_juridicas', label: 'Conhecimento Legal/Jurídico' }
          ].map((item) => (
            <div key={item.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  {item.label}
                </Label>
                <span className="text-sm font-bold text-stone-green-dark">
                  {formData[item.key as keyof DiagnosticoData] as number}
                </span>
              </div>
              <Slider
                value={[formData[item.key as keyof DiagnosticoData] as number]}
                onValueChange={(value) => handleSliderChange(item.key as keyof DiagnosticoData, value)}
                max={5}
                min={1}
                step={1}
                className="w-full slider-green"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Muito baixo</span>
                <span>5 - Muito alto</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Dor Principal do Momento</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="dor_principal" className="text-sm font-medium text-gray-700">
              Dor Principal do Momento
            </Label>
            <Select value={formData.dor_principal} onValueChange={(value) => handleInputChange('dor_principal', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione a dor principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Divulgação">Divulgação</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Organização">Organização</SelectItem>
                <SelectItem value="Finanças">Finanças</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="falta_caixa_financiamento" className="text-sm font-medium text-gray-700">
              Falta de Caixa / Financiamento
            </Label>
            <Textarea
              id="falta_caixa_financiamento"
              value={formData.falta_caixa_financiamento}
              onChange={(e) => handleInputChange('falta_caixa_financiamento', e.target.value)}
              placeholder="Descreva as dificuldades financeiras ou de financiamento..."
              className="min-h-[80px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dificuldade_funcionarios" className="text-sm font-medium text-gray-700">
              Dificuldade com Funcionários
            </Label>
            <Textarea
              id="dificuldade_funcionarios"
              value={formData.dificuldade_funcionarios}
              onChange={(e) => handleInputChange('dificuldade_funcionarios', e.target.value)}
              placeholder="Descreva as dificuldades relacionadas aos funcionários..."
              className="min-h-[80px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientes_reclamando" className="text-sm font-medium text-gray-700">
              Clientes Reclamando
            </Label>
            <Textarea
              id="clientes_reclamando"
              value={formData.clientes_reclamando}
              onChange={(e) => handleInputChange('clientes_reclamando', e.target.value)}
              placeholder="Descreva as reclamações dos clientes..."
              className="min-h-[80px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="relacionamento_fornecedores" className="text-sm font-medium text-gray-700">
              Relacionamento com Fornecedores
            </Label>
            <Textarea
              id="relacionamento_fornecedores"
              value={formData.relacionamento_fornecedores}
              onChange={(e) => handleInputChange('relacionamento_fornecedores', e.target.value)}
              placeholder="Descreva as dificuldades com fornecedores..."
              className="min-h-[80px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faBrain} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Teste Psicométrico</h3>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="perfil_investimento" className="text-sm font-medium text-gray-700">
              Perfil de Investimento
            </Label>
            <Select value={formData.perfil_investimento} onValueChange={(value) => handleInputChange('perfil_investimento', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione o perfil de investimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arriscado">Arriscado</SelectItem>
                <SelectItem value="Seguro">Seguro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo_desistencia" className="text-sm font-medium text-gray-700">
              Motivo de Desistência
            </Label>
            <Textarea
              id="motivo_desistencia"
              value={formData.motivo_desistencia}
              onChange={(e) => handleInputChange('motivo_desistencia', e.target.value)}
              placeholder="Descreva os motivos que poderiam levar à desistência do negócio..."
              className="min-h-[120px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faLightbulb} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Perfil de Personalidade</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Avalie cada aspecto de personalidade de 1 (discordo totalmente) a 4 (concordo totalmente):
        </p>
        
        <div className="space-y-6">
          {[
            { key: 'agir_primeiro_consequencias_depois', label: 'Prefiro agir primeiro e me preocupar com as consequências depois' },
            { key: 'pensar_varias_solucoes', label: 'Gosto de pensar em várias soluções para um problema' },
            { key: 'seguir_primeiro_pressentimento', label: 'Sigo primeiro meu pressentimento' },
            { key: 'fazer_coisas_antes_prazo', label: 'Faço as coisas antes do prazo' },
            { key: 'fracasso_nao_opcao', label: 'Fracasso não é uma opção para mim' },
            { key: 'decisao_negocio_correta', label: 'Minhas decisões sobre negócio são sempre corretas' },
            { key: 'focar_oportunidades_riscos', label: 'Foco mais em oportunidades do que em riscos' },
            { key: 'acreditar_sucesso', label: 'Sempre acreditei que teria sucesso' }
          ].map((item) => (
            <div key={item.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">
                  {item.label}
                </Label>
                <span className="text-sm font-bold text-stone-green-dark">
                  {formData[item.key as keyof DiagnosticoData] as number}
                </span>
              </div>
              <Slider
                value={[formData[item.key as keyof DiagnosticoData] as number]}
                onValueChange={(value) => handleSliderChange(item.key as keyof DiagnosticoData, value)}
                max={4}
                min={1}
                step={1}
                className="w-full slider-green"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1 - Discordo totalmente</span>
                <span>4 - Concordo totalmente</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )


  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      default: return null
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[90vh] lg:max-w-7xl xl:max-w-[90vw] p-0 bg-white flex flex-col">
        {/* Header fixo */}
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon 
                  icon={faBrain} 
                  className="h-6 w-6 text-white" 
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Diagnóstico da Mentoria
                </DialogTitle>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-stone-green-light/20 text-stone-green-dark border-0 px-3 py-1">
                    {negocioNome}
                  </Badge>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">Passo {currentStep} de {totalSteps}</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="text-lg font-medium text-gray-700">
                {getStepTitle(currentStep)}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    i + 1 <= currentStep 
                      ? 'bg-gradient-to-r from-stone-green-dark to-stone-green-light' 
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Identificação</span>
              <span>Maturidade</span>
              <span>Dor</span>
              <span>Teste</span>
              <span>Personalidade</span>
            </div>
          </div>
        </DialogHeader>
  
        {/* Conteúdo scrollável */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-stone-green-light border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">Salvando diagnóstico...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {renderCurrentStep()}
            </div>
          )}
        </div>
  
        {/* Footer fixo com botões */}
        <div className="p-6 pt-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="px-6 py-3 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="px-8 py-3 h-12 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg font-semibold"
                >
                  Próximo
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 h-12 bg-gradient-to-r from-stone-green-dark to-stone-green-light hover:from-stone-green-light hover:to-stone-green-dark text-white shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="h-4 w-4 mr-2" />
                      Salvar Diagnóstico
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
