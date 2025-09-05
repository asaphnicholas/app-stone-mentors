"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, Eye, EyeOff, User, Phone, Award, Users, TrendingUp, Target } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"
import { AREAS_ATUACAO } from "@/lib/constants/areas-atuacao"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    competencias: "",
    area_atuacao: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading } = useAuth()
  const { addToast } = useToast()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.nome.trim()) {
      addToast({
        type: "error",
        title: "Nome obrigatório",
        message: "Por favor, informe seu nome completo",
      })
      return false
    }

    if (!formData.email.trim()) {
      addToast({
        type: "error",
        title: "Email obrigatório",
        message: "Por favor, informe seu email",
      })
      return false
    }

    if (!formData.senha) {
      addToast({
        type: "error",
        title: "Senha obrigatória",
        message: "Por favor, informe uma senha",
      })
      return false
    }

    if (formData.senha.length < 6) {
      addToast({
        type: "error",
        title: "Senha muito curta",
        message: "A senha deve ter pelo menos 6 caracteres",
      })
      return false
    }

    if (formData.senha !== formData.confirmarSenha) {
      addToast({
        type: "error",
        title: "Senhas não coincidem",
        message: "As senhas informadas não são iguais",
      })
      return false
    }

    if (!formData.telefone.trim()) {
      addToast({
        type: "error",
        title: "Telefone obrigatório",
        message: "Por favor, informe seu telefone",
      })
      return false
    }

    if (!formData.competencias.trim()) {
      addToast({
        type: "error",
        title: "Competências obrigatórias",
        message: "Por favor, informe suas competências",
      })
      return false
    }

    if (!formData.area_atuacao) {
      addToast({
        type: "error",
        title: "Área de atuação obrigatória",
        message: "Por favor, selecione sua área de atuação",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone,
        competencias: formData.competencias,
        area_atuacao: formData.area_atuacao,
      })

      addToast({
        type: "success",
        title: "Cadastro realizado com sucesso!",
        message: "Bem-vindo à plataforma Stone Mentors!",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro no cadastro",
        message: error instanceof Error ? error.message : "Erro interno do servidor",
      })
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Seção Esquerda - Promocional */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/5"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Junte-se à nossa comunidade de mentores
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Faça parte da rede de mentores Stone e ajude outros profissionais a crescerem em suas carreiras
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Rede de Profissionais</h3>
                <p className="text-sm text-white/80">Conecte-se com outros mentores e mentorados</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Crescimento Profissional</h3>
                <p className="text-sm text-white/80">Desenvolva suas habilidades de mentoria</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Impacto Real</h3>
                <p className="text-sm text-white/80">Ajude outros a alcançarem seus objetivos</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-8 right-8 opacity-20">
            <div className="w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Seção Direita - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright rounded-2xl flex items-center justify-center shadow-lg mb-6 overflow-hidden">
              <Image
                src="/logo-stone.png"
                alt="Stone Mentors Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Criar conta</h2>
            <p className="text-gray-600">Junte-se à nossa comunidade de mentores</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome field */}
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="nome"
                  type="text"
                  placeholder="Seu nome completo"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Email field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Telefone field */}
            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-sm font-medium text-gray-700">
                Telefone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="telefone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange("telefone", e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Área de atuação */}
            <div className="space-y-2">
              <Label htmlFor="area_atuacao" className="text-sm font-medium text-gray-700">
                Área de atuação
              </Label>
              <Select value={formData.area_atuacao} onValueChange={(value) => handleInputChange("area_atuacao", value)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl">
                  <SelectValue placeholder="Selecione sua área" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS_ATUACAO.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Competências field */}
            <div className="space-y-2">
              <Label htmlFor="competencias" className="text-sm font-medium text-gray-700">
                Competências
              </Label>
              <div className="relative">
                <Award className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                <textarea
                  id="competencias"
                  placeholder="Descreva suas principais competências e experiências..."
                  value={formData.competencias}
                  onChange={(e) => handleInputChange("competencias", e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl resize-none"
                  rows={3}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={(e) => handleInputChange("senha", e.target.value)}
                  className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha" className="text-sm font-medium text-gray-700">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmarSenha"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirme sua senha"
                  value={formData.confirmarSenha}
                  onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                  className="pl-10 pr-12 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Criando conta...</span>
                </div>
              ) : (
                <span>Criar conta</span>
              )}
            </Button>

            {/* Login link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Já tem uma conta? </span>
              <Link
                href="/"
                className="text-stone-green-dark hover:text-stone-green-light font-medium transition-colors"
              >
                Faça login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
