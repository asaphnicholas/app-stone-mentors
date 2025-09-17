"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield, Users, Target, Award, AlertTriangle, Database, Eye, CheckCircle, Lock, Globe, Heart } from "lucide-react"

export default function TermoAceitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link
            href="/register"
            className="group inline-flex items-center gap-3 text-slate-600 hover:text-stone-green-dark transition-all duration-300 font-medium"
          >
            <div className="w-8 h-8 bg-slate-100 group-hover:bg-stone-green-light/20 rounded-full flex items-center justify-center transition-all duration-300">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            Voltar ao cadastro
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-12">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Hero Header */}
          <CardHeader className="bg-gradient-to-r from-stone-green-dark via-stone-green-light to-emerald-500 text-white relative overflow-hidden p-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-32 h-32 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 border border-white/20 rounded-full"></div>
              <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-white/20 rounded-full"></div>
            </div>
            
            <div className="relative p-12">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-4xl font-bold mb-2 leading-tight">
                    Consentimento e Termo de Participação
                  </CardTitle>
                  <p className="text-white/90 text-lg font-medium">
                    Mentoria Pro Bono Stone
                  </p>
                  <div className="flex items-center gap-2 mt-4 text-white/80">
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <span className="text-sm">Última atualização: {new Date().toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-12 space-y-12">
            {/* Declaração de Consentimento */}
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold">Declaração de Consentimento</h2>
                  </div>
                  <p className="text-white/95 text-lg leading-relaxed">
                    Ao confirmar a inscrição neste formulário e aceitar este termo, você declara estar de acordo com todas as condições estabelecidas abaixo para participação no <strong>Programa de Mentoria Pro Bono Stone</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Participação no Programa */}
              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Participação no Programa</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Mentoria Voluntária</p>
                        <p className="text-gray-700 text-sm">Sem qualquer custo ou obrigação financeira de ambas as partes.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Sem Vínculo Empregatício</p>
                        <p className="text-gray-700 text-sm">Atividade não gera vínculo empregatício, trabalhista ou previdenciário.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Responsabilidades do Mentor */}
              <div className="group hover:scale-[1.02] transition-all duration-300">
                <div className="bg-gradient-to-br from-stone-50 to-stone-100 p-8 rounded-2xl border border-stone-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-stone-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Target className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Responsabilidades</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Qualidade</p>
                        <p className="text-gray-700 text-sm">Orientação profissional baseada em experiência atualizada.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Confidencialidade</p>
                        <p className="text-gray-700 text-sm">Total sigilo sobre informações dos mentorados.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-white/60 rounded-xl">
                      <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-4 h-4 text-stone-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">Compromisso Ético</p>
                        <p className="text-gray-700 text-sm">Participação com respeito, ética e responsabilidade.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Proteção de Dados - LGPD */}
            <div className="relative">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-1 rounded-2xl shadow-2xl">
                <div className="bg-white p-10 rounded-2xl">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Proteção de Dados Pessoais</h2>
                      <p className="text-purple-600 font-medium">Conforme LGPD</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200/50">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                        <Database className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Finalidade dos Dados</h3>
                      <p className="text-gray-700 text-sm">Utilizados exclusivamente para gestão da mentoria, conforme LGPD.</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200/50">
                      <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                        <Globe className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Compartilhamento</h3>
                      <p className="text-gray-700 text-sm">Com instituições de pesquisa e entidades parceiras para desenvolvimento de projetos.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200/50">
                      <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">Anonimização</h3>
                      <p className="text-gray-700 text-sm">Dados podem ser anonimizados para fins estatísticos e de pesquisa.</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200/50">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Proteção Garantida:</strong> Todo compartilhamento será em conformidade com a legislação aplicável, com salvaguardas necessárias para proteção dos seus direitos e privacidade.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Uso de Imagem */}
            <div className="group hover:scale-[1.01] transition-all duration-300">
              <div className="bg-gradient-to-br from-green-50 to-teal-100 p-8 rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Eye className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Autorização de Uso de Imagem</h2>
                </div>
                
                <div className="bg-white/60 p-6 rounded-xl">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>Autorização:</strong> Autorizo o uso da minha imagem, voz e nome em materiais de comunicação relacionados ao programa, de forma gratuita e para fins institucionais.
                  </p>
                  <p className="text-sm text-gray-600">
                    Esta autorização inclui materiais promocionais, casos de sucesso, relatórios de impacto e outras comunicações oficiais do programa.
                  </p>
                </div>
              </div>
            </div>

            {/* Código de Conduta */}
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-10 rounded-2xl border border-slate-200/50 shadow-lg">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Shield className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Código de Conduta</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50">
                  <h3 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Comportamentos Esperados
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      Respeitar horários e comunicar atrasos
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      Preparação adequada para sessões
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      Feedback construtivo e orientações práticas
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      Promoção de ambiente inclusivo
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/50">
                  <h3 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Não Tolerados
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Discriminação de qualquer natureza
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Uso inadequado de informações confidenciais
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Comportamento não profissional
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      Falta de compromisso assumido
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Termos de Uso e Consequências - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Termos de Uso */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-8 rounded-2xl border border-blue-200/50 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Acesso à Plataforma</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-2">Recursos Disponíveis:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Dashboard personalizado</li>
                      <li>• Ferramentas de agendamento</li>
                      <li>• Materiais de treinamento</li>
                      <li>• Relatórios de progresso</li>
                    </ul>
                  </div>
                  <div className="bg-white/60 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Responsabilidade:</strong> Manter credenciais seguras e reportar uso não autorizado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Consequências */}
              <div className="bg-gradient-to-br from-orange-50 to-red-100 p-8 rounded-2xl border border-orange-200/50 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Consequências</h2>
                </div>
                
                <div className="bg-white/60 p-6 rounded-lg">
                  <p className="font-medium text-orange-800 mb-4">Descumprimento pode resultar em:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Advertência formal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Suspensão temporária</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">Remoção permanente</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirmação Final */}
            <div className="relative">
              <div className="bg-gradient-to-r from-stone-green-dark to-emerald-600 p-1 rounded-2xl shadow-xl">
                <div className="bg-white p-8 rounded-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-stone-green-dark to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Confirmação de Aceitação</h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-stone-green-dark/5 to-emerald-100/50 p-6 rounded-xl border border-stone-green-dark/20">
                    <p className="text-gray-200 font-medium leading-relaxed">
                      Ao marcar a caixa de aceite no formulário de cadastro, você declara ter lido, compreendido e aceito todos os termos e condições aqui estabelecidos, autorizando o tratamento dos seus dados pessoais para fins do <strong>Programa de Mentoria Pro Bono Stone</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="text-center bg-gradient-to-r from-slate-50 to-stone-100 p-8 rounded-2xl border border-slate-200/50">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Precisa de Ajuda?</h2>
              <p className="text-gray-700 mb-4">
                Para dúvidas sobre este termo, entre em contato conosco:
              </p>
              <a 
                href="mailto:contato@stonementors.com"
                className="inline-flex items-center gap-2 bg-stone-green-dark hover:bg-stone-green-light text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <span>contato@impulsostone.com.br</span>
              </a>
            </div>

            {/* Footer */}
            {/* <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-stone-green-dark to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Image
                      src="/logo-impulso-sembg.png"
                      alt="Stone Mentors Logo"
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stone Mentors</p>
                    <p className="text-sm text-gray-600">em parceria com Freehelper</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">Versão 2.0</p>
                  <p className="text-xs text-gray-500">{new Date().getFullYear()}</p>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}