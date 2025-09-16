"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Shield, Users, Target, Award } from "lucide-react"

export default function TermoAceitePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 text-stone-green-dark hover:text-stone-green-light transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao cadastro
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-stone-green-dark to-stone-green-light text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Termo de Aceite - Stone Mentors</CardTitle>
                <p className="text-white/90 mt-1">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Introdução */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">1. Introdução</h2>
              <p className="text-gray-700 leading-relaxed">
                Bem-vindo à plataforma Stone Mentors! Este termo de aceite estabelece as condições para sua participação como mentor em nossa comunidade. Ao aceitar este termo, você concorda em seguir todas as diretrizes e políticas estabelecidas.
              </p>
            </div>

            {/* Responsabilidades do Mentor */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">2. Responsabilidades do Mentor</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-stone-green-light/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-3 h-3 text-stone-green-dark" />
                  </div>
                  <p className="text-gray-700">
                    <strong>Compromisso com a Qualidade:</strong> Fornecer orientação profissional de alta qualidade, baseada em experiência e conhecimento atualizado.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-stone-green-light/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Target className="w-3 h-3 text-stone-green-dark" />
                  </div>
                  <p className="text-gray-700">
                    <strong>Confidencialidade:</strong> Manter total confidencialidade sobre informações compartilhadas pelos mentorados durante as sessões.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-stone-green-light/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-3 h-3 text-stone-green-dark" />
                  </div>
                  <p className="text-gray-700">
                    <strong>Profissionalismo:</strong> Manter conduta profissional em todas as interações, respeitando a diversidade e promovendo um ambiente inclusivo.
                  </p>
                </div>
              </div>
            </div>

            {/* Código de Conduta */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">3. Código de Conduta</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <h3 className="font-semibold text-gray-900">O que é esperado:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Respeitar os horários agendados e comunicar atrasos com antecedência</li>
                  <li>• Preparar-se adequadamente para cada sessão de mentoria</li>
                  <li>• Fornecer feedback construtivo e orientações práticas</li>
                  <li>• Manter atualização constante em sua área de expertise</li>
                  <li>• Reportar qualquer comportamento inadequado à administração</li>
                </ul>
                
                <h3 className="font-semibold text-gray-900 mt-4">O que não é tolerado:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Discriminação de qualquer natureza</li>
                  <li>• Uso inadequado de informações confidenciais</li>
                  <li>• Comportamento não profissional ou inadequado</li>
                  <li>• Falta de compromisso com as responsabilidades assumidas</li>
                </ul>
              </div>
            </div>

            {/* Política de Privacidade */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">4. Política de Privacidade</h2>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="w-3 h-3 text-blue-600" />
                </div>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Proteção de Dados:</strong> Seus dados pessoais são protegidos conforme a LGPD (Lei Geral de Proteção de Dados). Utilizamos suas informações apenas para:
                  </p>
                  <ul className="ml-4 space-y-1">
                    <li>• Facilitar o processo de mentoria</li>
                    <li>• Melhorar a experiência da plataforma</li>
                    <li>• Comunicar atualizações importantes</li>
                    <li>• Gerar relatórios de impacto (dados anonimizados)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Termos de Uso */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">5. Termos de Uso da Plataforma</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Acesso à Plataforma:</strong> Como mentor, você terá acesso a:
                </p>
                <ul className="ml-4 space-y-1">
                  <li>• Dashboard personalizado com suas mentorias</li>
                  <li>• Ferramentas de agendamento e comunicação</li>
                  <li>• Materiais de treinamento e desenvolvimento</li>
                  <li>• Relatórios de progresso e impacto</li>
                </ul>
                
                <p className="mt-4">
                  <strong>Responsabilidades Técnicas:</strong> É sua responsabilidade manter suas credenciais seguras e reportar qualquer uso não autorizado de sua conta.
                </p>
              </div>
            </div>

            {/* Consequências */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">6. Consequências do Descumprimento</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Importante:</strong> O descumprimento deste termo pode resultar em:
                </p>
                <ul className="mt-2 space-y-1 text-yellow-700">
                  <li>• Advertência formal</li>
                  <li>• Suspensão temporária da plataforma</li>
                  <li>• Remoção permanente da comunidade</li>
                </ul>
              </div>
            </div>

            {/* Aceitação */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">7. Aceitação do Termo</h2>
              <p className="text-gray-700">
                Ao marcar a caixa de aceite no formulário de cadastro, você declara ter lido, compreendido e aceito todos os termos e condições aqui estabelecidos.
              </p>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">8. Contato</h2>
              <p className="text-gray-700">
                Para dúvidas sobre este termo, entre em contato conosco através do email: <strong>contato@stonementors.com</strong>
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src="/lofo-impulso-sembg.png"
                    alt="Stone Mentors Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                  <span className="text-sm text-gray-600">Stone Mentors</span>
                </div>
                <div className="text-sm text-gray-500">
                  Versão 1.0 - {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
