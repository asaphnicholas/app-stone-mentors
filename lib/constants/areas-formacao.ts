// Áreas de formação definidas no banco de dados
// CREATE TYPE area_formacao AS ENUM (...)
export const AREAS_FORMACAO = [
  { 
    value: "ADMINISTRACAO", 
    label: "Administração" 
  },
  { 
    value: "ECONOMIA_FINANCAS", 
    label: "Economia & Finanças" 
  },
  { 
    value: "ENGENHARIA", 
    label: "Engenharia" 
  },
  { 
    value: "CIENCIA_COMPUTACAO_TI", 
    label: "Ciência da Computação & TI" 
  },
  { 
    value: "MARKETING_PUBLICIDADE", 
    label: "Marketing & Publicidade" 
  },
  { 
    value: "RELACOES_PUBLICAS_JORNALISMO", 
    label: "Relações Públicas & Jornalismo" 
  },
  { 
    value: "DIREITO", 
    label: "Direito" 
  },
  { 
    value: "RECURSOS_HUMANOS_PSICOLOGIA", 
    label: "Recursos Humanos & Psicologia" 
  },
  { 
    value: "RELACOES_INTERNACIONAIS", 
    label: "Relações Internacionais" 
  },
  { 
    value: "DESIGN_UX", 
    label: "Design & UX" 
  },
  { 
    value: "OUTRO", 
    label: "Outro" 
  },
] as const

// Tipo TypeScript para as áreas de formação
export type AreaFormacao = typeof AREAS_FORMACAO[number]['value']

// Função helper para obter o label de uma área de formação
export function getAreaFormacaoLabel(value: AreaFormacao): string {
  const area = AREAS_FORMACAO.find(area => area.value === value)
  return area?.label || value
}

// Função helper para validar se uma área de formação é válida
export function isValidAreaFormacao(value: string): value is AreaFormacao {
  return AREAS_FORMACAO.some(area => area.value === value)
}
