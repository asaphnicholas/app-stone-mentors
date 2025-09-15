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
  
  // ===== 1. IDENTIFICAÇÃO =====
  nome_completo?: string
  email?: string
  telefone_whatsapp?: string
  status_negocio?: string
  tempo_funcionamento?: string
  setor_atuacao?: string
  
  // ===== 2. MATURIDADE NAS ÁREAS DO NEGÓCIO (1-5) =====
  controle_financeiro?: number
  divulgacao_marketing?: number
  atrair_clientes_vender?: number
  atender_clientes?: number
  ferramentas_gestao?: number
  organizacao_negocio?: number
  obrigacoes_legais_juridicas?: number
  
  // ===== 3. DOR PRINCIPAL DO MOMENTO =====
  dor_principal?: string
  falta_caixa_financiamento?: string
  dificuldade_funcionarios?: string
  clientes_reclamando?: string
  relacionamento_fornecedores?: string
  
  // ===== 4. PSICOMÉTRICO =====
  perfil_investimento?: string
  motivo_desistencia?: string
  
  // ===== 5. TESTE DE PERSONALIDADE (1-4) =====
  agir_primeiro_consequencias_depois?: number
  pensar_varias_solucoes?: number
  seguir_primeiro_pressentimento?: number
  fazer_coisas_antes_prazo?: number
  fracasso_nao_opcao?: number
  decisao_negocio_correta?: number
  focar_oportunidades_riscos?: number
  acreditar_sucesso?: number
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
      {(diagnostico.controle_financeiro || diagnostico.divulgacao_marketing || diagnostico.atrair_clientes_vender || diagnostico.atender_clientes || diagnostico.ferramentas_gestao || diagnostico.organizacao_negocio || diagnostico.obrigacoes_legais_juridicas) && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
          <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faChartLine} className="h-3 w-3 text-white" />
            </div>
            Avaliação de Maturidade (1-5)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {diagnostico.controle_financeiro && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Controle Financeiro</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.controle_financeiro * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.controle_financeiro}/5</span>
                </div>
              </div>
            )}
            {diagnostico.divulgacao_marketing && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Divulgação do Negócio</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.divulgacao_marketing * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.divulgacao_marketing}/5</span>
                </div>
              </div>
            )}
            {diagnostico.atrair_clientes_vender && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Atrair Clientes e Vender</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.atrair_clientes_vender * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.atrair_clientes_vender}/5</span>
                </div>
              </div>
            )}
            {diagnostico.atender_clientes && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Atendimento aos Clientes</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.atender_clientes * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.atender_clientes}/5</span>
                </div>
              </div>
            )}
            {diagnostico.ferramentas_gestao && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Ferramentas de Gestão</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.ferramentas_gestao * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.ferramentas_gestao}/5</span>
                </div>
              </div>
            )}
            {diagnostico.organizacao_negocio && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Organização do Negócio</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.organizacao_negocio * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.organizacao_negocio}/5</span>
                </div>
              </div>
            )}
            {diagnostico.obrigacoes_legais_juridicas && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Conhecimento Legal/Jurídico</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.obrigacoes_legais_juridicas * 20} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.obrigacoes_legais_juridicas}/5</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dor Principal do Momento */}
      {(diagnostico.dor_principal || diagnostico.falta_caixa_financiamento || diagnostico.dificuldade_funcionarios || diagnostico.clientes_reclamando || diagnostico.relacionamento_fornecedores) && (
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 shadow-sm">
          <h4 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-3 w-3 text-white" />
            </div>
            Dor Principal do Momento
          </h4>
          <div className="space-y-3">
            {diagnostico.dor_principal && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dor Principal</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.dor_principal}</p>
              </div>
            )}
            {diagnostico.falta_caixa_financiamento && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Falta de Caixa / Financiamento</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.falta_caixa_financiamento}</p>
              </div>
            )}
            {diagnostico.dificuldade_funcionarios && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Dificuldade com Funcionários</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.dificuldade_funcionarios}</p>
              </div>
            )}
            {diagnostico.clientes_reclamando && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Clientes Reclamando</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.clientes_reclamando}</p>
              </div>
            )}
            {diagnostico.relacionamento_fornecedores && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Relacionamento com Fornecedores</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.relacionamento_fornecedores}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teste Psicométrico */}
      {(diagnostico.perfil_investimento || diagnostico.motivo_desistencia) && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm">
          <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faGraduationCap} className="h-3 w-3 text-white" />
            </div>
            Teste Psicométrico
          </h4>
          <div className="space-y-3">
            {diagnostico.perfil_investimento && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Perfil de Investimento</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.perfil_investimento}</p>
              </div>
            )}
            {diagnostico.motivo_desistencia && (
              <div className="p-3 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Motivo de Desistência</span>
                <p className="text-gray-900 leading-relaxed text-sm mt-1">{diagnostico.motivo_desistencia}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Personalidade */}
      {(diagnostico.agir_primeiro_consequencias_depois || diagnostico.pensar_varias_solucoes || diagnostico.seguir_primeiro_pressentimento || diagnostico.fazer_coisas_antes_prazo || diagnostico.fracasso_nao_opcao || diagnostico.decisao_negocio_correta || diagnostico.focar_oportunidades_riscos || diagnostico.acreditar_sucesso) && (
        <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200 shadow-sm">
          <h4 className="font-bold text-pink-900 mb-3 flex items-center gap-2 text-base">
            <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="h-3 w-3 text-white" />
            </div>
            Perfil de Personalidade (1-4)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnostico.agir_primeiro_consequencias_depois && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Agir Primeiro, Consequências Depois</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.agir_primeiro_consequencias_depois * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.agir_primeiro_consequencias_depois}/4</span>
                </div>
              </div>
            )}
            {diagnostico.pensar_varias_solucoes && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Pensar Várias Soluções</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.pensar_varias_solucoes * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.pensar_varias_solucoes}/4</span>
                </div>
              </div>
            )}
            {diagnostico.seguir_primeiro_pressentimento && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Seguir Primeiro Pressentimento</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.seguir_primeiro_pressentimento * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.seguir_primeiro_pressentimento}/4</span>
                </div>
              </div>
            )}
            {diagnostico.fazer_coisas_antes_prazo && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fazer Coisas Antes do Prazo</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.fazer_coisas_antes_prazo * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.fazer_coisas_antes_prazo}/4</span>
                </div>
              </div>
            )}
            {diagnostico.fracasso_nao_opcao && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Fracasso Não é Opção</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.fracasso_nao_opcao * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.fracasso_nao_opcao}/4</span>
                </div>
              </div>
            )}
            {diagnostico.decisao_negocio_correta && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Decisões de Negócio Corretas</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.decisao_negocio_correta * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.decisao_negocio_correta}/4</span>
                </div>
              </div>
            )}
            {diagnostico.focar_oportunidades_riscos && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Focar Oportunidades vs Riscos</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.focar_oportunidades_riscos * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.focar_oportunidades_riscos}/4</span>
                </div>
              </div>
            )}
            {diagnostico.acreditar_sucesso && (
              <div className="p-2 bg-white/60 rounded-lg">
                <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Acreditar no Sucesso</span>
                <div className="flex items-center gap-2">
                  <Progress value={diagnostico.acreditar_sucesso * 25} className="flex-1 h-2" />
                  <span className="font-bold text-gray-900 text-sm">{diagnostico.acreditar_sucesso}/4</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
