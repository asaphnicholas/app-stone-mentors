// Áreas de atuação para negócios (conforme documentação da API)
export const AREAS_NEGOCIO = [
  { 
    value: "TECNOLOGIA", 
    label: "Tecnologia" 
  },
  { 
    value: "SAUDE", 
    label: "Saúde" 
  },
  { 
    value: "EDUCACAO", 
    label: "Educação" 
  },
  { 
    value: "FINANCAS", 
    label: "Finanças" 
  },
  { 
    value: "COMERCIO", 
    label: "Comércio" 
  },
  { 
    value: "SERVICOS", 
    label: "Serviços" 
  },
  { 
    value: "INDUSTRIA", 
    label: "Indústria" 
  },
  { 
    value: "AGRONEGOCIO", 
    label: "Agronegócio" 
  },
  { 
    value: "TURISMO", 
    label: "Turismo" 
  },
  { 
    value: "CONSTRUCAO", 
    label: "Construção" 
  },
  { 
    value: "TRANSPORTE", 
    label: "Transporte" 
  },
  { 
    value: "ENTRETENIMENTO", 
    label: "Entretenimento" 
  },
  { 
    value: "ALIMENTACAO", 
    label: "Alimentação" 
  },
  { 
    value: "MODA", 
    label: "Moda" 
  },
  { 
    value: "BELEZA", 
    label: "Beleza" 
  },
  { 
    value: "OUTROS", 
    label: "Outros" 
  },
] as const

// Tipo TypeScript para as áreas de negócio
export type AreaNegocio = typeof AREAS_NEGOCIO[number]['value']

// Função helper para obter o label de uma área de negócio
export function getAreaNegocioLabel(value: AreaNegocio): string {
  const area = AREAS_NEGOCIO.find(area => area.value === value)
  return area?.label || value
}

// Função helper para validar se uma área de negócio é válida
export function isValidAreaNegocio(value: string): value is AreaNegocio {
  return AREAS_NEGOCIO.some(area => area.value === value)
}
