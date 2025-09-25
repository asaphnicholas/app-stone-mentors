// Áreas de atuação para negócios
export const AREAS_NEGOCIO = [
  { 
    value: "SERVICOS", 
    label: "Serviços" 
  },
  { 
    value: "COMERCIO", 
    label: "Comércio" 
  },
  { 
    value: "TECNOLOGIA", 
    label: "Tecnologia" 
  },
  { 
    value: "FINANCAS", 
    label: "Finanças" 
  },
  { 
    value: "JURIDICO_COMPLIANCE", 
    label: "Jurídico & Compliance" 
  },
  { 
    value: "REGULATORIO", 
    label: "Regulatório" 
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
