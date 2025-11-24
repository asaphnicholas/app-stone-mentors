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
  faEdit,
  faClipboardList
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

type DiagnosticoField = keyof DiagnosticoData

type StepGuide = {
  description: string
  tips: string[]
}

const DEFAULT_GUIDE: StepGuide = {
  description: "Preencha as informações com base no que foi alinhado com o empreendedor e mantenha o máximo de detalhes possíveis.",
  tips: [
    "Revise as respostas antes de avançar para evitar retrabalho.",
    "Use a própria fala do empreendedor sempre que precisar registrar um contexto."
  ],
}

const STEP_GUIDE: Record<number, StepGuide> = {
  1: {
    description: "Registre os dados básicos confirmados com o empreendedor. Eles serão usados para contatos e relatórios.",
    tips: [
      "Confirme telefone e e-mail durante a mentoria para evitar dados incorretos.",
      "Se não houver uma data precisa para o tempo de funcionamento, registre a melhor estimativa combinada."
    ],
  },
  2: {
    description: "Avalie a maturidade de cada área com a percepção compartilhada pelo empreendedor. Utilize notas de 0 (muito baixo) a 4 (muito alto).",
    tips: [
      "Explique a escala antes de registrar a nota para alinhar expectativas.",
      "Se optar por 0 ou 4, registre mentalmente o motivo para possíveis questionamentos futuros."
    ],
  },
  3: {
    description: "Documente a principal dor do momento e detalhe o contexto de cada desafio para orientar os próximos passos.",
    tips: [
      "Prefira frases completas que deixem claro o cenário e o impacto no negócio.",
      "Caso exista mais de uma dor, priorize aquela que impede o negócio de avançar."
    ],
  },
  4: {
    description: "Mapeie o perfil comportamental do empreendedor. Essas respostas ajudam a personalizar os encaminhamentos.",
    tips: [
      "Utilize exemplos da conversa para justificar o perfil de investimento escolhido.",
      "Registre os gatilhos reais que poderiam levar à desistência."
    ],
  },
  5: {
    description: "Atribua a intensidade de comportamentos e crenças usando a percepção do mentor e do empreendedor.",
    tips: [
      "Não deixe itens zerados por falta de resposta; negocie uma nota que represente a fala do empreendedor.",
      "Se houver dúvida, registre um comentário em observações gerais da mentoria."
    ],
  },
}

const REQUIRED_FIELDS: Record<number, { field: DiagnosticoField; label: string }[]> = {
  1: [
    { field: "nome_completo", label: "Nome completo" },
    { field: "email", label: "E-mail" },
    { field: "telefone_whatsapp", label: "Telefone WhatsApp" },
    { field: "status_negocio", label: "Status do negócio" },
    { field: "tempo_funcionamento", label: "Tempo de funcionamento" },
    { field: "setor_atuacao", label: "Setor de atuação" },
  ],
  3: [
    { field: "dor_principal", label: "Dor principal" },
    { field: "falta_caixa_financiamento", label: "Falta de caixa / financiamento" },
    { field: "dificuldade_funcionarios", label: "Dificuldades com funcionários" },
    { field: "clientes_reclamando", label: "Clientes reclamando" },
    { field: "relacionamento_fornecedores", label: "Relacionamento com fornecedores" },
  ],
  4: [
    { field: "perfil_investimento", label: "Perfil de investimento" },
    { field: "motivo_desistencia", label: "Motivo de desistência" },
  ],
}

const FIELD_HELPERS: Partial<Record<DiagnosticoField, string>> = {
  nome_completo: "Use o mesmo nome registrado no cadastro ou documento oficial.",
  email: "Preferencialmente o e-mail que o empreendedor acompanha diariamente.",
  telefone_whatsapp: "Inclua o DDD e confirme se o número possui WhatsApp ativo.",
  status_negocio: "Ajuda o programa a entender se o negócio já está rodando ou ainda em planejamento.",
  tempo_funcionamento: "Escolha a faixa mais próxima do tempo informado na mentoria.",
  setor_atuacao: "Selecione o setor predominante do negócio para melhor categorização.",
  dor_principal: "Descreva com as palavras do empreendedor qual dor impede o avanço do negócio.",
  falta_caixa_financiamento: "Detalhe os desafios financeiros, como falta de capital de giro ou crédito.",
  dificuldade_funcionarios: "Registre dificuldades com contratação, treinamento ou retenção.",
  clientes_reclamando: "Liste os principais motivos das reclamações para direcionar ações.",
  relacionamento_fornecedores: "Explique se há atraso, negociação difícil ou dependência de poucos fornecedores.",
  perfil_investimento: "Perfil usado para sugerir materiais e oportunidades coerentes.",
  motivo_desistencia: "Quais fatores poderiam fazer o empreendedor desistir do negócio.",
}

const FIELD_ERROR_MESSAGES: Partial<Record<DiagnosticoField, string>> = {
  nome_completo: "Informe o nome completo do empreendedor.",
  email: "Precisamos de um e-mail válido para contato.",
  telefone_whatsapp: "Inclua um telefone com DDD para contatos via WhatsApp.",
  status_negocio: "Selecione o status atual do negócio.",
  tempo_funcionamento: "Informe há quanto tempo o negócio funciona.",
  setor_atuacao: "Selecione o setor de atuação.",
  dor_principal: "Defina a dor principal alinhada com o empreendedor.",
  falta_caixa_financiamento: "Descreva o cenário financeiro para contextualizar o diagnóstico.",
  clientes_reclamando: "Explique as principais reclamações dos clientes.",
  perfil_investimento: "Selecione o perfil que melhor representa o empreendedor.",
  motivo_desistencia: "Explique o que poderia gerar desistência.",
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
    
    // ===== 2. MATURIDADE NAS ÁREAS DO NEGÓCIO (0-4) =====
    controle_financeiro: 0,
    divulgacao_marketing: 0,
    atrair_clientes_vender: 0,
    atender_clientes: 0,
    ferramentas_gestao: 0,
    organizacao_negocio: 0,
    obrigacoes_legais_juridicas: 0,
    
    // ===== 3. DOR PRINCIPAL DO MOMENTO =====
    dor_principal: '',
    falta_caixa_financiamento: '',
    dificuldade_funcionarios: '',
    clientes_reclamando: '',
    relacionamento_fornecedores: '',
    
    // ===== 4. PSICOMÉTRICO =====
    perfil_investimento: '',
    motivo_desistencia: '',
    
    // ===== 5. TESTE DE PERSONALIDADE (0-4) =====
    agir_primeiro_consequencias_depois: 0,
    pensar_varias_solucoes: 0,
    seguir_primeiro_pressentimento: 0,
    fazer_coisas_antes_prazo: 0,
    fracasso_nao_opcao: 0,
    decisao_negocio_correta: 0,
    focar_oportunidades_riscos: 0,
    acreditar_sucesso: 0
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [fieldErrors, setFieldErrors] = useState<DiagnosticoField[]>([])
  const { addToast } = useToast()

  const totalSteps = 5
  const currentGuide = STEP_GUIDE[currentStep] ?? DEFAULT_GUIDE

  const isValueEmpty = (value: DiagnosticoData[DiagnosticoField]) =>
    value === "" || value === null || value === undefined

  const isFieldInvalid = (field: DiagnosticoField) => fieldErrors.includes(field)

  const getInteractiveFieldClasses = (field: DiagnosticoField) =>
    `border-2 transition-all duration-200 ${
      isFieldInvalid(field)
        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20"
    }`

  const FieldHelperText = ({ field }: { field: DiagnosticoField }) => {
    if (isFieldInvalid(field)) {
      return (
        <p className="text-xs text-red-600">
          {FIELD_ERROR_MESSAGES[field] ?? "Campo obrigatório."}
        </p>
      )
    }

    if (!FIELD_HELPERS[field]) {
      return null
    }

    return <p className="text-xs text-gray-500">{FIELD_HELPERS[field]}</p>
  }

  const validateStep = (step: number) => {
    const requirements = REQUIRED_FIELDS[step] ?? []
    const missing = requirements
      .filter(({ field }) => isValueEmpty(formData[field]))
      .map(({ field }) => field)

    const missingLabels = requirements
      .filter(({ field }) => missing.includes(field))
      .map(({ label }) => label)

    return {
      isValid: missing.length === 0,
      missing,
      missingLabels,
    }
  }

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

    if (fieldErrors.includes(field as DiagnosticoField) && !isValueEmpty(value)) {
      setFieldErrors(prev => prev.filter(item => item !== field))
    }
  }

  const handleSliderChange = (field: keyof DiagnosticoData, value: number[]) => {
    setFormData(prev => ({ ...prev, [field]: value[0] }))
  }

  const handleSubmit = async () => {
    for (let step = 1; step <= totalSteps; step++) {
      const result = validateStep(step)
      if (!result.isValid) {
        const missingFields = result.missing as DiagnosticoField[]
        setCurrentStep(step)
        setFieldErrors(missingFields)
        addToast({
          type: "error",
          title: "Finalize os campos obrigatórios",
          message:
            result.missingLabels.length > 0
              ? `Passo ${step}: ${result.missingLabels.join(", ")}`
              : "Revise os campos sinalizados em vermelho.",
        })
        return
      }
    }

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
    if (currentStep >= totalSteps) return

    const result = validateStep(currentStep)

    if (!result.isValid) {
      setFieldErrors(result.missing as DiagnosticoField[])
      addToast({
        type: "error",
        title: "Preencha os campos obrigatórios",
        message:
          result.missingLabels.length > 0
            ? `Revise: ${result.missingLabels.join(", ")}`
            : "Revise os campos sinalizados em vermelho.",
      })
      return
    }

    setFieldErrors([])
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setFieldErrors([])
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
              className={getInteractiveFieldClasses('nome_completo')}
            />
            <FieldHelperText field="nome_completo" />
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
              className={getInteractiveFieldClasses('email')}
            />
            <FieldHelperText field="email" />
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
              className={getInteractiveFieldClasses('telefone_whatsapp')}
            />
            <FieldHelperText field="telefone_whatsapp" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status_negocio" className="text-sm font-medium text-gray-700">
              Status do Negócio *
            </Label>
            <Select value={formData.status_negocio} onValueChange={(value) => handleInputChange('status_negocio', value)}>
              <SelectTrigger className={getInteractiveFieldClasses('status_negocio')}>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Já possuo">Já possuo um negócio</SelectItem>
                <SelectItem value="Estou planejando iniciar um">Estou planejando iniciar um negócio</SelectItem>
              </SelectContent>
            </Select>
            <FieldHelperText field="status_negocio" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tempo_funcionamento" className="text-sm font-medium text-gray-700">
              Tempo de Funcionamento *
            </Label>
            <Select value={formData.tempo_funcionamento} onValueChange={(value) => handleInputChange('tempo_funcionamento', value)}>
              <SelectTrigger className={getInteractiveFieldClasses('tempo_funcionamento')}>
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
            <FieldHelperText field="tempo_funcionamento" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="setor_atuacao" className="text-sm font-medium text-gray-700">
              Setor de Atuação *
            </Label>
            <Select value={formData.setor_atuacao} onValueChange={(value) => handleInputChange('setor_atuacao', value)}>
              <SelectTrigger className={getInteractiveFieldClasses('setor_atuacao')}>
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
            <FieldHelperText field="setor_atuacao" />
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
          Avalie cada aspecto de 0 (muito baixo) a 4 (muito alto):
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
                max={4}
                min={0}
                step={1}
                className="w-full slider-green"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - Muito baixo</span>
                <span>4 - Muito alto</span>
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
              <SelectTrigger className={getInteractiveFieldClasses('dor_principal')}>
                <SelectValue placeholder="Selecione a dor principal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Divulgação">Divulgação</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
                <SelectItem value="Organização">Organização</SelectItem>
                <SelectItem value="Finanças">Finanças</SelectItem>
              </SelectContent>
            </Select>
            <FieldHelperText field="dor_principal" />
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
              className={`min-h-[80px] ${getInteractiveFieldClasses('falta_caixa_financiamento')}`}
            />
            <FieldHelperText field="falta_caixa_financiamento" />
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
              className={`min-h-[80px] ${getInteractiveFieldClasses('dificuldade_funcionarios')}`}
            />
            <FieldHelperText field="dificuldade_funcionarios" />
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
              className={`min-h-[80px] ${getInteractiveFieldClasses('clientes_reclamando')}`}
            />
            <FieldHelperText field="clientes_reclamando" />
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
              className={`min-h-[80px] ${getInteractiveFieldClasses('relacionamento_fornecedores')}`}
            />
            <FieldHelperText field="relacionamento_fornecedores" />
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
              <SelectTrigger className={getInteractiveFieldClasses('perfil_investimento')}>
                <SelectValue placeholder="Selecione o perfil de investimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arriscado">Arriscado</SelectItem>
                <SelectItem value="Seguro">Seguro</SelectItem>
              </SelectContent>
            </Select>
            <FieldHelperText field="perfil_investimento" />
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
              className={`min-h-[120px] ${getInteractiveFieldClasses('motivo_desistencia')}`}
            />
            <FieldHelperText field="motivo_desistencia" />
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
                min={0}
                step={1}
                className="w-full slider-green"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 - Discordo totalmente</span>
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
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-5 bg-stone-green-light/10 border border-stone-green-light/40 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-inner text-stone-green-dark mx-auto md:mx-0">
                    <FontAwesomeIcon icon={faClipboardList} className="h-5 w-5" />
                  </div>
                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-xs uppercase tracking-wide text-stone-green-dark font-semibold">
                      Orientações do passo atual
                    </p>
                    <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                      {currentGuide.description}
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Campos marcados com * são obrigatórios.</li>
                      {currentGuide.tips.map((tip) => (
                        <li key={tip}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

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
