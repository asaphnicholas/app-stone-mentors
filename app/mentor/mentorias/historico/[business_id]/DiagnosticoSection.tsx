"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faUser, 
  faChartLine, 
  faExclamationTriangle, 
  faGraduationCap, 
  faClipboardList 
} from "@fortawesome/free-solid-svg-icons"
import { Progress } from "@/components/ui/progress"
import { type MentoriaHistory } from "@/lib/services/mentorias"

interface DiagnosticoCompleto {
  id: string
  created_at: string
  
  // Campos Originais (compatibilidade)
  tempo_mercado?: string
  faturamento_mensal?: string
  num_funcionarios?: string
  desafios?: string[]
  observacoes?: string
  
  // Novos Campos - Identificação
  nome_completo?: string
  email?: string
  telefone_whatsapp?: string
  status_negocio?: string
  tempo_funcionamento?: string
  setor_atuacao?: string
  
  // Avaliação de Maturidade (1-5)
  organizacao_financeira?: number
  divulgacao_marketing?: number
  estrategia_comercial?: number
  relacionamento_cliente?: number
  ferramentas_digitais?: number
  planejamento_gestao?: number
  conhecimento_legal?: number
  
  // Dor Principal
  dor_principal?: string
  
  // Teste Psicométrico
  perfil_risco?: string
  questao_logica?: string
  questao_memoria?: string
  
  // Personalidade (1-4)
  personalidade_agir_primeiro?: number
  personalidade_solucoes_problemas?: number
  personalidade_pressentimento?: number
  personalidade_prazo?: number
  personalidade_fracasso_opcao?: number
  personalidade_decisao_correta?: number
  personalidade_oportunidades_riscos?: number
  personalidade_sucesso?: number
}

interface DiagnosticoSectionProps {
  diagnostico: DiagnosticoCompleto | null | undefined
}

export default function DiagnosticoSection({ diagnostico }: DiagnosticoSectionProps) {
  if (!diagnostico) return null

  return (
    <div className="mb-4 space-y-4">
      {/* Identificação do Empreendedor */}
      {(diagnostico.nome_completo || diagnostico.email || diagnostico.telefone_whatsapp || diagnostico.status_negocio || diagnostico.tempo_funcionamento || diagnostico.setor_atuacao) && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
          <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-white" />
            </div>
            Identificação do Empreendedor
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {diagnostico.nome_completo && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Nome Completo</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.nome_completo}</p>
              </div>
            )}
            {diagnostico.email && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">E-mail</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.email}</p>
              </div>
            )}
            {diagnostico.telefone_whatsapp && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">WhatsApp</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.telefone_whatsapp}</p>
              </div>
            )}
            {diagnostico.status_negocio && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Status do Negócio</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.status_negocio}</p>
              </div>
            )}
            {diagnostico.tempo_funcionamento && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tempo de Funcionamento</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.tempo_funcionamento}</p>
              </div>
            )}
            {diagnostico.setor_atuacao && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Setor de Atuação</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.setor_atuacao}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Avaliação de Maturidade */}
      {(diagnostico.organizacao_financeira || diagnostico.divulgacao_marketing || diagnostico.estrategia_comercial || diagnostico.relacionamento_cliente || diagnostico.ferramentas_digitais || diagnostico.planejamento_gestao || diagnostico.conhecimento_legal) && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
          <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 text-white" />
            </div>
            Avaliação de Maturidade (1-5)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {diagnostico.organizacao_financeira && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Organização Financeira</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.organizacao_financeira * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.organizacao_financeira}/5</span>
                </div>
              </div>
            )}
            {diagnostico.divulgacao_marketing && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Divulgação/Marketing</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.divulgacao_marketing * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.divulgacao_marketing}/5</span>
                </div>
              </div>
            )}
            {diagnostico.estrategia_comercial && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Estratégia Comercial</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.estrategia_comercial * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.estrategia_comercial}/5</span>
                </div>
              </div>
            )}
            {diagnostico.relacionamento_cliente && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Relacionamento Cliente</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.relacionamento_cliente * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.relacionamento_cliente}/5</span>
                </div>
              </div>
            )}
            {diagnostico.ferramentas_digitais && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ferramentas Digitais</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.ferramentas_digitais * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.ferramentas_digitais}/5</span>
                </div>
              </div>
            )}
            {diagnostico.planejamento_gestao && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Planejamento/Gestão</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.planejamento_gestao * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.planejamento_gestao}/5</span>
                </div>
              </div>
            )}
            {diagnostico.conhecimento_legal && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Conhecimento Legal</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.conhecimento_legal * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.conhecimento_legal}/5</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dor Principal */}
      {diagnostico.dor_principal && (
        <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 shadow-sm">
          <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 text-white" />
            </div>
            Dor Principal
          </h4>
          <div className="p-3 bg-white/60 rounded-lg">
            <p className="text-gray-900 leading-relaxed text-sm">{diagnostico.dor_principal}</p>
          </div>
        </div>
      )}

      {/* Teste Psicométrico */}
      {(diagnostico.perfil_risco || diagnostico.questao_logica || diagnostico.questao_memoria) && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3 text-white" />
            </div>
            Teste Psicométrico
          </h4>
          <div className="space-y-3">
            {diagnostico.perfil_risco && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Perfil de Risco</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.perfil_risco}</p>
              </div>
            )}
            {diagnostico.questao_logica && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Questão Lógica</span>
                <p className="font-bold text-gray-900 text-sm mt-1">{diagnostico.questao_logica}</p>
              </div>
            )}
            {diagnostico.questao_memoria && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Questão de Memória</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.questao_memoria}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personalidade */}
      {(diagnostico.personalidade_agir_primeiro || diagnostico.personalidade_solucoes_problemas || diagnostico.personalidade_pressentimento || diagnostico.personalidade_prazo || diagnostico.personalidade_fracasso_opcao || diagnostico.personalidade_decisao_correta || diagnostico.personalidade_oportunidades_riscos || diagnostico.personalidade_sucesso) && (
        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-sm">
          <h4 className="font-bold text-yellow-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-white" />
            </div>
            Perfil de Personalidade (1-4)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnostico.personalidade_agir_primeiro && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Agir Primeiro</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_agir_primeiro * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_agir_primeiro}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_solucoes_problemas && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Soluções/Problemas</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_solucoes_problemas * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_solucoes_problemas}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_pressentimento && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pressentimento</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_pressentimento * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_pressentimento}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_prazo && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Prazo</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_prazo * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_prazo}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_fracasso_opcao && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fracasso é Opção</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_fracasso_opcao * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_fracasso_opcao}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_decisao_correta && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Decisão Correta</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_decisao_correta * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_decisao_correta}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_oportunidades_riscos && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Oportunidades/Riscos</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_oportunidades_riscos * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_oportunidades_riscos}/4</span>
                </div>
              </div>
            )}
            {diagnostico.personalidade_sucesso && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Sucesso</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.personalidade_sucesso * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.personalidade_sucesso}/4</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Campos Originais (Compatibilidade) */}
      {(diagnostico.tempo_mercado || diagnostico.faturamento_mensal || diagnostico.num_funcionarios || diagnostico.desafios || diagnostico.observacoes) && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200 shadow-sm">
          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faClipboardList} className="h-3 w-3 text-white" />
            </div>
            Informações Adicionais
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
            {diagnostico.tempo_mercado && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Tempo no mercado</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.tempo_mercado}</p>
              </div>
            )}
            {diagnostico.faturamento_mensal && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Faturamento</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.faturamento_mensal}</p>
              </div>
            )}
            {diagnostico.num_funcionarios && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Funcionários</span>
                <p className="font-bold text-gray-900 text-sm">{diagnostico.num_funcionarios}</p>
              </div>
            )}
          </div>
          {diagnostico.desafios && diagnostico.desafios.length > 0 && (
            <div className="mb-3 p-2 bg-white/60 rounded-lg">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Principais Desafios</span>
              <p className="font-bold text-gray-900 text-sm">{diagnostico.desafios.join(', ')}</p>
            </div>
          )}
          {diagnostico.observacoes && (
            <div className="p-2 bg-white/60 rounded-lg">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Observações</span>
              <p className="text-gray-900 leading-relaxed text-sm">{diagnostico.observacoes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
