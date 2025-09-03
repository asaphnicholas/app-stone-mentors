"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, User, Phone, MapPin, Star, Target, FileText } from "lucide-react"
import { useToast } from "@/components/ui/toast"

// Mock business data
const businessData = {
  id: "1",
  nome: "Padaria do Bairro",
  contato: "Maria Santos",
  telefone: "(11) 99999-9999",
  segmento: "Alimentação",
  localizacao: "Centro, São Paulo",
  dataAgendamento: "15/01/2024 às 15:00",
}

const tempoMercadoOptions = ["Menos de 6 meses", "6 meses a 1 ano", "1 a 2 anos", "2 a 5 anos", "Mais de 5 anos"]

const faturamentoOptions = [
  "Até R$ 5.000",
  "R$ 5.001 a R$ 15.000",
  "R$ 15.001 a R$ 30.000",
  "R$ 30.001 a R$ 50.000",
  "Mais de R$ 50.000",
]

const funcionariosOptions = ["Apenas o proprietário", "2 a 5 funcionários", "6 a 10 funcionários", "Mais de 10"]

const desafiosOptions = [
  "Gestão financeira",
  "Marketing digital",
  "Vendas",
  "Operações",
  "Recursos humanos",
  "Planejamento estratégico",
  "Atendimento ao cliente",
  "Controle de estoque",
  "Precificação",
  "Concorrência",
]

interface DiagnosticFormData {
  tempoMercado: string
  faturamento: string
  funcionarios: string
  desafios: string[]
  observacoes: string
}

export default function DiagnosticoPage() {
  const params = useParams()
  const router = useRouter()
  const { addToast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<DiagnosticFormData>({
    tempoMercado: "",
    faturamento: "",
    funcionarios: "",
    desafios: [],
    observacoes: "",
  })

  const handleDesafioChange = (desafio: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      desafios: checked ? [...prev.desafios, desafio] : prev.desafios.filter((d) => d !== desafio),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      addToast({
        type: "success",
        title: "Diagnóstico salvo!",
        message: "As informações foram registradas com sucesso.",
      })

      // Redirect to checkout
      router.push(`/mentor/checkout/${params.id}`)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao salvar",
        message: "Não foi possível salvar o diagnóstico. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.tempoMercado && formData.faturamento && formData.funcionarios && formData.desafios.length > 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Business Info Header */}
      <Card className="border-2 border-stone-green-light/30 bg-stone-green-light/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-stone-green-dark">
            <Building2 className="h-6 w-6" />
            Diagnóstico - {businessData.nome}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.contato}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.telefone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Badge variant="outline">{businessData.segmento}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{businessData.localizacao}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Data/Hora da Mentoria:</span>
            <span>{businessData.dataAgendamento}</span>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostic Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-stone-green-light" />
              Informações Básicas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tempoMercado">Tempo de mercado</Label>
                <Select
                  value={formData.tempoMercado}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tempoMercado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {tempoMercadoOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faturamento">Faturamento mensal</Label>
                <Select
                  value={formData.faturamento}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, faturamento: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {faturamentoOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funcionarios">Número de funcionários</Label>
                <Select
                  value={formData.funcionarios}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, funcionarios: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {funcionariosOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Challenges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-stone-green-light" />
              Principais Desafios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {desafiosOptions.map((desafio) => (
                <div key={desafio} className="flex items-center space-x-3">
                  <Checkbox
                    id={desafio}
                    checked={formData.desafios.includes(desafio)}
                    onCheckedChange={(checked) => handleDesafioChange(desafio, checked as boolean)}
                  />
                  <Label htmlFor={desafio} className="text-sm font-medium leading-none">
                    {desafio}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-stone-green-light" />
              Observações da Mentoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="observacoes">Descreva os principais pontos abordados na mentoria</Label>
              <Textarea
                id="observacoes"
                placeholder="Descreva os principais tópicos discutidos, insights compartilhados, recomendações feitas e próximos passos sugeridos..."
                value={formData.observacoes}
                onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
                rows={6}
                className="resize-none"
              />
              <div className="text-xs text-muted-foreground text-right">
                {formData.observacoes.length}/1000 caracteres
              </div>
            </div>
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
            {isSubmitting ? "Salvando..." : "Salvar e Continuar"}
          </Button>
        </div>
      </form>
    </div>
  )
}
