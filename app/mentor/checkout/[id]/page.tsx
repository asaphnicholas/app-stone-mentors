"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, User, Clock, Star, MessageSquare, ArrowRight } from "lucide-react"
import { useToast } from "@/components/ui/toast"

// Mock business data
const businessData = {
  id: "1",
  nome: "Padaria do Bairro",
  contato: "Maria Santos",
  segmento: "Alimentação",
  dataAgendamento: "15/01/2024 às 15:00",
}

const duracaoOptions = ["15 min", "30 min", "45 min", "60 min", "90+ min"]

interface CheckoutFormData {
  duracao: string
  nps: number
  feedback: string
  proximosPassos: "agendar" | "finalizar"
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<CheckoutFormData>({
    duracao: "",
    nps: 0,
    feedback: "",
    proximosPassos: "agendar",
  })

  const handleNPSClick = (score: number) => {
    setFormData((prev) => ({ ...prev, nps: score }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      addToast({
        type: "success",
        title: "Check-out realizado!",
        message: "Mentoria finalizada com sucesso.",
      })

      // Redirect based on next steps
      if (formData.proximosPassos === "agendar") {
        router.push(`/mentor/mentorias?schedule=${params.id}`)
      } else {
        router.push("/mentor/mentorias")
      }
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao finalizar",
        message: "Não foi possível finalizar a mentoria. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getNPSColor = (score: number) => {
    if (score >= 9) return "text-green-600"
    if (score >= 7) return "text-yellow-600"
    return "text-red-600"
  }

  const getNPSLabel = (score: number) => {
    if (score >= 9) return "Promotor"
    if (score >= 7) return "Neutro"
    return "Detrator"
  }

  const isFormValid = formData.duracao && formData.nps > 0 && formData.feedback.trim() && formData.proximosPassos

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Business Info Header */}
      <Card className="border-2 border-stone-green-light/30 bg-stone-green-light/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-green-dark">
            <Building2 className="h-6 w-6" />
            Check-out - {businessData.nome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.contato}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">{businessData.segmento}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.dataAgendamento}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-stone-green-light" />
              Duração da Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.duracao}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, duracao: value }))}
              className="grid grid-cols-2 md:grid-cols-5 gap-4"
            >
              {duracaoOptions.map((duracao) => (
                <div key={duracao} className="flex items-center space-x-2">
                  <RadioGroupItem value={duracao} id={duracao} />
                  <Label htmlFor={duracao} className="text-sm font-medium">
                    {duracao}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* NPS Rating */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-stone-green-light" />
              Como foi a mentoria?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Muito insatisfeito</span>
                <span>Muito satisfeito</span>
              </div>
              <div className="flex justify-center gap-2">
                {[...Array(10)].map((_, i) => {
                  const score = i + 1
                  const isSelected = formData.nps === score
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => handleNPSClick(score)}
                      className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${
                        isSelected
                          ? score >= 9
                            ? "bg-green-500 border-green-500 text-white"
                            : score >= 7
                              ? "bg-yellow-500 border-yellow-500 text-white"
                              : "bg-red-500 border-red-500 text-white"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {score}
                    </button>
                  )
                })}
              </div>
              {formData.nps > 0 && (
                <div className="text-center">
                  <span className={`font-medium ${getNPSColor(formData.nps)}`}>
                    {formData.nps}/10 - {getNPSLabel(formData.nps)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-stone-green-light" />
              Feedback da Sessão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="feedback">Descreva como foi a mentoria, principais pontos abordados...</Label>
              <Textarea
                id="feedback"
                placeholder="Descreva os principais tópicos discutidos, resultados alcançados, recomendações feitas e como o empreendedor reagiu às orientações..."
                value={formData.feedback}
                onChange={(e) => setFormData((prev) => ({ ...prev, feedback: e.target.value }))}
                rows={5}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">{formData.feedback.length}/500 caracteres</div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRight className="h-5 w-5 text-stone-green-light" />
              Próximos Passos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.proximosPassos}
              onValueChange={(value: "agendar" | "finalizar") =>
                setFormData((prev) => ({ ...prev, proximosPassos: value }))
              }
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="agendar" id="agendar" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="agendar" className="font-medium">
                    Agendar nova mentoria
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    O empreendedor precisa de mais acompanhamento e orientações
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="finalizar" id="finalizar" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="finalizar" className="font-medium">
                    Finalizar acompanhamento
                  </Label>
                  <p className="text-sm text-muted-foreground">O empreendedor está preparado para seguir sozinho</p>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
            disabled={isSubmitting}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="flex-1 bg-stone-green-light hover:bg-stone-green-dark"
          >
            {isSubmitting ? "Finalizando..." : "Finalizar Mentoria"}
          </Button>
        </div>
      </form>
    </div>
  )
}
