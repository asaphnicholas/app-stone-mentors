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
import { useToast } from "@/hooks/use-toast"
import { mentoriasService } from "@/lib/services/mentorias"

interface DiagnosticoData {
  // Campos de Identificação
  nome_completo: string
  email: string
  telefone_whatsapp: string
  status_negocio: string
  tempo_funcionamento: string
  setor_atuacao: string
  
  // Avaliação de Maturidade (1-5)
  organizacao_financeira: number
  divulgacao_marketing: number
  estrategia_comercial: number
  relacionamento_cliente: number
  ferramentas_digitais: number
  planejamento_gestao: number
  conhecimento_legal: number
  
  // Dor Principal
  dor_principal: string
  
  // Teste Psicométrico
  perfil_risco: string
  questao_logica: string
  questao_memoria: string
  
  // Personalidade (1-4)
  personalidade_agir_primeiro: number
  personalidade_solucoes_problemas: number
  personalidade_pressentimento: number
  personalidade_prazo: number
  personalidade_fracasso_opcao: number
  personalidade_decisao_correta: number
  personalidade_oportunidades_riscos: number
  personalidade_sucesso: number
  
  // Campos Originais (compatibilidade)
  tempo_mercado: string
  faturamento_mensal: string
  num_funcionarios: string
  desafios: string[]
  observacoes: string
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
    // Campos de Identificação
    nome_completo: '',
    email: '',
    telefone_whatsapp: '',
    status_negocio: '',
    tempo_funcionamento: '',
    setor_atuacao: '',
    
    // Avaliação de Maturidade (1-5)
    organizacao_financeira: 1,
    divulgacao_marketing: 1,
    estrategia_comercial: 1,
    relacionamento_cliente: 1,
    ferramentas_digitais: 1,
    planejamento_gestao: 1,
    conhecimento_legal: 1,
    
    // Dor Principal
    dor_principal: '',
    
    // Teste Psicométrico
    perfil_risco: '',
    questao_logica: '',
    questao_memoria: '',
    
    // Personalidade (1-4)
    personalidade_agir_primeiro: 1,
    personalidade_solucoes_problemas: 1,
    personalidade_pressentimento: 1,
    personalidade_prazo: 1,
    personalidade_fracasso_opcao: 1,
    personalidade_decisao_correta: 1,
    personalidade_oportunidades_riscos: 1,
    personalidade_sucesso: 1,
    
    // Campos Originais
    tempo_mercado: '',
    faturamento_mensal: '',
    num_funcionarios: '',
    desafios: [],
    observacoes: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [desafioInput, setDesafioInput] = useState('')
  const { toast } = useToast()

  const totalSteps = 6

  const handleInputChange = (field: keyof DiagnosticoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSliderChange = (field: keyof DiagnosticoData, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }))
  }

  const addDesafio = () => {
    if (desafioInput.trim()) {
      setFormData(prev => ({
        ...prev,
        desafios: [...prev.desafios, desafioInput.trim()]
      }))
      setDesafioInput('')
    }
  }

  const removeDesafio = (index: number) => {
    setFormData(prev => ({
      ...prev,
      desafios: prev.desafios.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      
      await mentoriasService.updateDiagnostico(mentoriaId, formData)
      
      toast({
        title: "Diagnóstico salvo com sucesso!",
        description: "O diagnóstico foi registrado para esta mentoria.",
      })
      
      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: "Erro ao salvar diagnóstico",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
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
      case 3: return "Dor Principal"
      case 4: return "Teste Psicométrico"
      case 5: return "Perfil de Personalidade"
      case 6: return "Informações Complementares"
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
              onChange={(e) => handleInputChange('telefone_whatsapp', e.target.value)}
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
            <Input
              id="tempo_funcionamento"
              value={formData.tempo_funcionamento}
              onChange={(e) => handleInputChange('tempo_funcionamento', e.target.value)}
              placeholder="Ex: 2 anos, 6 meses, etc."
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setor_atuacao" className="text-sm font-medium text-gray-700">
              Setor de Atuação *
            </Label>
            <Input
              id="setor_atuacao"
              value={formData.setor_atuacao}
              onChange={(e) => handleInputChange('setor_atuacao', e.target.value)}
              placeholder="Ex: Tecnologia, Varejo, Serviços"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
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
            { key: 'organizacao_financeira', label: 'Organização Financeira e Controle de Despesas' },
            { key: 'divulgacao_marketing', label: 'Divulgação, Marketing e Produção de Conteúdo' },
            { key: 'estrategia_comercial', label: 'Estratégia Comercial e Vendas' },
            { key: 'relacionamento_cliente', label: 'Relacionamento e Atendimento ao Cliente' },
            { key: 'ferramentas_digitais', label: 'Uso de Ferramentas Digitais, Aplicativos e Planilhas' },
            { key: 'planejamento_gestao', label: 'Planejamento, Gestão do Tempo e Organização de Processos' },
            { key: 'conhecimento_legal', label: 'Conhecimento das Obrigações Legais e Jurídicas do Negócio' }
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
          <h3 className="text-lg font-bold text-gray-900">Dor Principal</h3>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dor_principal" className="text-sm font-medium text-gray-700">
            Dor Principal do Momento *
          </Label>
          <Textarea
            id="dor_principal"
            value={formData.dor_principal}
            onChange={(e) => handleInputChange('dor_principal', e.target.value)}
            placeholder="Descreva qual é a principal dificuldade ou desafio que o empreendedor está enfrentando no momento..."
            className="min-h-[120px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
          />
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
            <Label htmlFor="perfil_risco" className="text-sm font-medium text-gray-700">
              Perfil de Risco *
            </Label>
            <Select value={formData.perfil_risco} onValueChange={(value) => handleInputChange('perfil_risco', value)}>
              <SelectTrigger className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20">
                <SelectValue placeholder="Selecione o perfil de risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Investimento arriscado">Investimento arriscado</SelectItem>
                <SelectItem value="Investimento seguro">Investimento seguro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questao_logica" className="text-sm font-medium text-gray-700">
              Questão Lógica (Sequência Numérica) *
            </Label>
            <Input
              id="questao_logica"
              value={formData.questao_logica}
              onChange={(e) => handleInputChange('questao_logica', e.target.value)}
              placeholder="Ex: 2, 4, 6, 8, ?"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="questao_memoria" className="text-sm font-medium text-gray-700">
              Questão de Memória (Evento) *
            </Label>
            <Input
              id="questao_memoria"
              value={formData.questao_memoria}
              onChange={(e) => handleInputChange('questao_memoria', e.target.value)}
              placeholder="Descreva um evento específico mencionado"
              className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
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
            { key: 'personalidade_agir_primeiro', label: 'Prefiro agir primeiro e me preocupar depois' },
            { key: 'personalidade_solucoes_problemas', label: 'Gosto de pensar em várias soluções para um problema' },
            { key: 'personalidade_pressentimento', label: 'Sigo primeiro meu pressentimento' },
            { key: 'personalidade_prazo', label: 'Faço as coisas antes do prazo' },
            { key: 'personalidade_fracasso_opcao', label: 'Fracasso não é uma opção para mim' },
            { key: 'personalidade_decisao_correta', label: 'Minhas decisões sobre negócio são sempre corretas' },
            { key: 'personalidade_oportunidades_riscos', label: 'Foco mais em oportunidades do que em riscos' },
            { key: 'personalidade_sucesso', label: 'Sempre acreditei que teria sucesso' }
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

  const renderStep6 = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-stone-green-light to-stone-green-dark rounded-xl flex items-center justify-center">
            <FontAwesomeIcon icon={faEdit} className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Informações Complementares</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tempo_mercado" className="text-sm font-medium text-gray-700">
                Tempo no Mercado
              </Label>
              <Input
                id="tempo_mercado"
                value={formData.tempo_mercado}
                onChange={(e) => handleInputChange('tempo_mercado', e.target.value)}
                placeholder="Ex: 2 anos"
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="faturamento_mensal" className="text-sm font-medium text-gray-700">
                Faturamento Mensal
              </Label>
              <Input
                id="faturamento_mensal"
                value={formData.faturamento_mensal}
                onChange={(e) => handleInputChange('faturamento_mensal', e.target.value)}
                placeholder="Ex: R$ 10.000"
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="num_funcionarios" className="text-sm font-medium text-gray-700">
                Número de Funcionários
              </Label>
              <Input
                id="num_funcionarios"
                value={formData.num_funcionarios}
                onChange={(e) => handleInputChange('num_funcionarios', e.target.value)}
                placeholder="Ex: 5 funcionários"
                className="border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Desafios Identificados
            </Label>
            <div className="flex gap-2">
              <Input
                value={desafioInput}
                onChange={(e) => setDesafioInput(e.target.value)}
                placeholder="Digite um desafio e pressione Enter"
                className="flex-1 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDesafio())}
              />
              <Button onClick={addDesafio} variant="outline" size="sm">
                Adicionar
              </Button>
            </div>
            {formData.desafios.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.desafios.map((desafio, index) => (
                  <div key={index} className="flex items-center gap-1 bg-stone-green-light/20 text-stone-green-dark px-2 py-1 rounded-md text-sm">
                    <span>{desafio}</span>
                    <button
                      onClick={() => removeDesafio(index)}
                      className="text-stone-green-dark hover:text-stone-green-dark/70"
                    >
                      <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-sm font-medium text-gray-700">
              Observações da Mentoria
            </Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações gerais sobre a mentoria e o empreendedor..."
              className="min-h-[120px] border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
            />
          </div>
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
      case 6: return renderStep6()
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
              <span>Complementares</span>
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
