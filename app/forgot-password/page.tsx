"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { authService } from "@/lib/services/auth"
import { useToast } from "@/components/ui/toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      addToast({
        type: "error",
        title: "Email obrigatório",
        message: "Por favor, digite seu email",
      })
      return
    }

    setIsLoading(true)

    try {
      await authService.forgotPassword(email)
      setIsEmailSent(true)
      addToast({
        type: "success",
        title: "Email enviado!",
        message: "Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao enviar email",
        message: error instanceof Error ? error.message : "Não foi possível enviar o email. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Seção Esquerda - Promocional */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Email enviado com sucesso!
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
              </p>
            </div>
          </div>
        </div>

        {/* Seção Direita - Confirmação */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Email enviado!</h2>
                <p className="text-gray-600 mt-2">
                  Enviamos um link para redefinir sua senha para <strong>{email}</strong>
                </p>
              </div>
            </div>

            <Card className="border-2 border-gray-100">
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-gray-600">
                  <p className="font-medium">Próximos passos:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Verifique sua caixa de entrada</li>
                    <li>Procure por um email da Stone Mentors</li>
                    <li>Clique no link para redefinir sua senha</li>
                    <li>Digite sua nova senha</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button
                onClick={() => {
                  setIsEmailSent(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-xl font-medium"
              >
                Enviar para outro email
              </Button>

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-stone-green-dark hover:text-stone-green-light font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Seção Esquerda - Promocional */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Esqueceu sua senha?
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Não se preocupe! Vamos te ajudar a redefinir sua senha de forma segura.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Email Seguro</h3>
                <p className="text-sm text-white/80">Enviaremos um link seguro para seu email</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Processo Rápido</h3>
                <p className="text-sm text-white/80">Redefina sua senha em poucos minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Direita - Formulário */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 items-center justify-center">
              <Image
                src="/lofo-impulso-sembg.png"
                alt="Stone Mentors Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Redefinir senha</h2>
            <p className="text-gray-600">Digite seu email para receber o link de redefinição</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando...</span>
                </div>
              ) : (
                <span>Enviar link de redefinição</span>
              )}
            </Button>

            {/* Back to login */}
            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-stone-green-dark hover:text-stone-green-light font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
