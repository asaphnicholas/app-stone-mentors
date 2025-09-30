// Áreas de atuação para negócios
export const AREAS_NEGOCIO = [
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
    value: "TECNOLOGIA", 
    label: "Tecnologia" 
  },
  { 
    value: "SAUDE_BEM_ESTAR", 
    label: "Saúde e bem-estar" 
  },
  { 
    value: "SERVICOS", 
    label: "Serviços" 
  },
  { 
    value: "OUTRO", 
    label: "Outro" 
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
