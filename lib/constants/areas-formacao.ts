// Escolaridade (campo area_formacao na API)
// Valores enviados/recebidos pela API e labels exibidos no front
export const ESCOLARIDADE_OPCOES = [
  { value: 'ensino_medio_completo', label: 'Ensino Médio Completo' },
  { value: 'ensino_medio_incompleto', label: 'Ensino Médio Incompleto' },
  { value: 'ensino_superior_completo', label: 'Ensino Superior Completo' },
  { value: 'ensino_superior_incompleto', label: 'Ensino Superior Incompleto' },
  { value: 'pos_graduacao_completa', label: 'Pós-Graduação Completa' },
  { value: 'pos_graduacao_incompleta', label: 'Pós-Graduação Incompleta' },
  { value: 'mestrado', label: 'Mestrado' },
  { value: 'doutorado', label: 'Doutorado' },
] as const

/** @deprecated Use ESCOLARIDADE_OPCOES. Mantido para compatibilidade de imports. */
export const AREAS_FORMACAO = ESCOLARIDADE_OPCOES

export type Escolaridade = (typeof ESCOLARIDADE_OPCOES)[number]['value']

/** @deprecated Use Escolaridade. Mantido para compatibilidade. */
export type AreaFormacao = Escolaridade

/**
 * Retorna o label de escolaridade para exibição.
 * area_formacao vazio ou desconhecido retorna "—" (não informado).
 */
export function getAreaFormacaoLabel(value: string | null | undefined): string {
  if (value == null || value === '') return '—'
  const opcao = ESCOLARIDADE_OPCOES.find((o) => o.value === value)
  return opcao?.label ?? '—'
}

/** Valida se o valor é uma das opções de escolaridade. */
export function isValidAreaFormacao(value: string): value is Escolaridade {
  return ESCOLARIDADE_OPCOES.some((o) => o.value === value)
}
