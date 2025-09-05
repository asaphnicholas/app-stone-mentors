// Áreas de atuação definidas no banco de dados
// CREATE TYPE area_atuacao AS ENUM (...)
export const AREAS_ATUACAO = [
  { 
    value: "comunicacao_marketing", 
    label: "Comunicação & Marketing" 
  },
  { 
    value: "contabilidade_financas", 
    label: "Contabilidade & Finanças" 
  },
  { 
    value: "juridico", 
    label: "Jurídico" 
  },
  { 
    value: "tecnologia", 
    label: "Tecnologia" 
  },
  { 
    value: "recursos_humanos", 
    label: "Recursos Humanos" 
  },
  { 
    value: "comercial_vendas", 
    label: "Comercial & Vendas" 
  },
  { 
    value: "outras", 
    label: "Outras" 
  },
] as const

// Tipo TypeScript para as áreas de atuação
export type AreaAtuacao = typeof AREAS_ATUACAO[number]['value']

// Função helper para obter o label de uma área
export function getAreaAtuacaoLabel(value: AreaAtuacao): string {
  const area = AREAS_ATUACAO.find(area => area.value === value)
  return area?.label || value
}

// Função helper para validar se uma área é válida
export function isValidAreaAtuacao(value: string): value is AreaAtuacao {
  return AREAS_ATUACAO.some(area => area.value === value)
}
