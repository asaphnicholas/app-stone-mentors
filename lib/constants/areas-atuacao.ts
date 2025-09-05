// Áreas de atuação definidas no banco de dados
// CREATE TYPE area_atuacao AS ENUM (...)
export const AREAS_ATUACAO = [
  { 
    value: "TECNOLOGIA", 
    label: "Tecnologia" 
  },
  { 
    value: "VAREJO", 
    label: "Varejo" 
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
    value: "SAUDE", 
    label: "Saúde" 
  },
  { 
    value: "EDUCACAO", 
    label: "Educação" 
  },
  { 
    value: "FINANCEIRO", 
    label: "Financeiro" 
  },
  { 
    value: "AGRONEGOCIO", 
    label: "Agronegócio" 
  },
  { 
    value: "COMERCIAL_VENDAS", 
    label: "Comercial & Vendas" 
  },
  { 
    value: "COMUNICACAO_MARKETING", 
    label: "Comunicação & Marketing" 
  },
  { 
    value: "OUTROS", 
    label: "Outros" 
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
