"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { authService } from "@/lib/services/auth"
import { useToast } from "@/components/ui/toast"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addToast } = useToast()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      addToast({
        type: "error",
        title: "Token inválido",
        message: "Link de redefinição inválido ou expirado.",
      })
      router.push('/forgot-password')
      return
    }
    setToken(tokenParam)
  }, [searchParams, router, addToast])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!password) {
      newErrors.password = "Senha é obrigatória"
    } else if (password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmação de senha é obrigatória"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !token) {
      return
    }

    setIsLoading(true)

    try {
      await authService.resetPassword(token, password)
      setIsSuccess(true)
      addToast({
        type: "success",
        title: "Senha redefinida!",
        message: "Sua senha foi alterada com sucesso. Você já pode fazer login.",
      })
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao redefinir senha",
        message: error instanceof Error ? error.message : "Não foi possível redefinir a senha. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white">
        {/* Seção Esquerda - Promocional */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright relative overflow-hidden">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative z-10 flex flex-col justify-center px-12 text-white">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Senha redefinida com sucesso!
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Sua senha foi alterada com segurança. Você já pode fazer login com sua nova senha.
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
                <h2 className="text-3xl font-bold text-gray-900">Sucesso!</h2>
                <p className="text-gray-600 mt-2">
                  Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                </p>
              </div>
            </div>

            <Button
              onClick={() => router.push('/')}
              className="w-full h-12 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 border-0"
            >
              Fazer login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">Token inválido</h2>
          <p className="text-gray-600">Link de redefinição inválido ou expirado.</p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-stone-green-dark hover:text-stone-green-light font-medium transition-colors"
          >
            Solicitar novo link
          </Link>
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
              Defina sua nova senha
            </h1>
            <p className="text-lg text-white/90 leading-relaxed">
              Crie uma senha segura para proteger sua conta.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Senha Segura</h3>
                <p className="text-sm text-white/80">Use pelo menos 6 caracteres</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Confirmação</h3>
                <p className="text-sm text-white/80">Digite a senha novamente para confirmar</p>
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
                src="/logo.png"
                alt="Stone Mentors Logo"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Nova senha</h2>
            <p className="text-gray-600">Digite sua nova senha abaixo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-12 h-12 border-2 transition-all duration-200 rounded-xl ${
                    errors.password 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20'
                  }`}
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
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-12 h-12 border-2 transition-all duration-200 rounded-xl ${
                    errors.confirmPassword 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 focus:border-stone-green-dark focus:ring-stone-green-dark/20'
                  }`}
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
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
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
                  <span>Redefinindo...</span>
                </div>
              ) : (
                <span>Redefinir senha</span>
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
