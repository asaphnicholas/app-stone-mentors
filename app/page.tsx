"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff, Users, TrendingUp, Target, Award } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login(email, password)
      addToast({
        type: "success",
        title: "Login realizado com sucesso!",
        message: "Redirecionando para o dashboard...",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro no login",
        message: error instanceof Error ? error.message : "Credenciais inválidas",
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
            Sua jornada como mentor em um só lugar.
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
            Formação, agendamentos e registro do impacto
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Gestão de Mentores</h3>
                <p className="text-sm text-white/80">Organize e acompanhe todos os mentores</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Acompanhamento</h3>
                <p className="text-sm text-white/80">Monitore o progresso dos mentorados</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Resultados</h3>
                <p className="text-sm text-white/80">Visualize métricas e conquistas</p>
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
            <div className="mx-auto w-20 h-20 items-center justify-center  ">
              <Image
                src="/lofo-impulso-sembg.png"
                alt="Stone Mentors Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h2>
            <p className="text-gray-600">Faça login na sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Demo credentials */}
            {/* <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-stone-green-dark" />
                <p className="font-medium text-sm text-stone-green-dark">Credenciais de demonstração</p>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="font-medium">Admin:</span> admin@stonementors.com</p>
                <p><span className="font-medium">Mentor:</span> mentor@stonementors.com</p>
                <p><span className="font-medium">Senha:</span> 123456</p>
              </div>
            </div> */}

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20 transition-all duration-200 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-stone-green-dark hover:text-stone-green-light transition-colors font-medium"
              >
                Esqueceu a senha?
              </button>
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
                  <span>Entrando...</span>
                </div>
              ) : (
                <span>Entrar</span>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou entre com</span>
              </div>
            </div>

            {/* Social login buttons */}
            {/* <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                  Google
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-blue-600 rounded-full"></div>
                  Facebook
                </div>
              </Button>
            </div> */}

            {/* Sign up link */}
            <div className="text-center text-sm">
              <span className="text-gray-600">Não tem uma conta? </span>
              <Link
                href="/register"
                className="text-stone-green-dark hover:text-stone-green-light font-medium transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
