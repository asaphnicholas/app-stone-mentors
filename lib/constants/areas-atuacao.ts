// Áreas de atuação definidas no banco de dados
// CREATE TYPE area_atuacao AS ENUM (...)
export const AREAS_ATUACAO = [
  { 
    value: "RELACIONAMENTO_CLIENTE", 
    label: "Relacionamento com Cliente" 
  },
  { 
    value: "COMERCIAL_POLOS", 
    label: "Comercial - Polos" 
  },
  { 
    value: "CANAL_FRANQUIAS", 
    label: "Canal - Franquias" 
  },
  { 
    value: "CANAL_TON_REX", 
    label: "Canal - Ton Rex" 
  },
  { 
    value: "GENTE_GESTAO", 
    label: "Gente & Gestão" 
  },
  { 
    value: "TECNOLOGIA_ENGENHARIA", 
    label: "Tecnologia & Engenharia" 
  },
  { 
    value: "TESOURARIA", 
    label: "Tesouraria" 
  },
  { 
    value: "MARKETING_ESTRATEGIA", 
    label: "Marketing & Estratégia" 
  },
  { 
    value: "JURIDICO_COMPLIANCE", 
    label: "Jurídico & Compliance" 
  },
  { 
    value: "FINANCEIRO", 
    label: "Financeiro" 
  },
  { 
    value: "CREDITO", 
    label: "Crédito" 
  },
  { 
    value: "BANKING", 
    label: "Banking" 
  },
  { 
    value: "SOFTWARE", 
    label: "Software" 
  },
  { 
    value: "REGULATORIO", 
    label: "Regulatório" 
  },
  { 
    value: "RISCOS", 
    label: "Riscos" 
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
