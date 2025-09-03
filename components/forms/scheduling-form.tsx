"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { useToast } from "@/components/ui/toast"

interface SchedulingFormProps {
  businessName: string
  contactName: string
  onSubmit?: (data: SchedulingFormData) => void
  onCancel?: () => void
}

interface SchedulingFormData {
  date: string
  time: string
  type: "primeira" | "followup"
  location: "presencial" | "online"
  address?: string
  notes?: string
}

// Generate time slots from 8:00 to 18:00
const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

export function SchedulingForm({ businessName, contactName, onSubmit, onCancel }: SchedulingFormProps) {
  const [formData, setFormData] = useState<SchedulingFormData>({
    date: "",
    time: "",
    type: "primeira",
    location: "presencial",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addToast({
        type: "success",
        title: "Mentoria agendada!",
        message: `Agendamento confirmado para ${formData.date} às ${formData.time}`,
      })

      onSubmit?.(formData)
    } catch (error) {
      addToast({
        type: "error",
        title: "Erro ao agendar",
        message: "Não foi possível agendar a mentoria. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const minDate = new Date().toISOString().split("T")[0]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-stone-green-light" />
          Agendar Mentoria
        </CardTitle>
        <CardDescription>
          Agendamento para <strong>{businessName}</strong> - {contactName}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data
              </Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Horário
              </Label>
              <Select
                value={formData.time}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mentoring Type */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de Mentoria</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "primeira" | "followup") => setFormData((prev) => ({ ...prev, type: value }))}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="primeira" id="primeira" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="primeira" className="font-medium">
                    Primeira Mentoria
                  </Label>
                  <p className="text-sm text-muted-foreground">(Diagnóstico obrigatório)</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="followup" id="followup" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="followup" className="font-medium">
                    Mentoria de Follow-up
                  </Label>
                  <p className="text-sm text-muted-foreground">Acompanhamento e orientações</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Local da Mentoria</Label>
            <RadioGroup
              value={formData.location}
              onValueChange={(value: "presencial" | "online") => setFormData((prev) => ({ ...prev, location: value }))}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="presencial" id="presencial" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="presencial" className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Presencial
                  </Label>
                  <p className="text-sm text-muted-foreground">No local do cliente ou escritório</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg">
                <RadioGroupItem value="online" id="online" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="online" className="font-medium flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Online
                  </Label>
                  <p className="text-sm text-muted-foreground">Videoconferência (Zoom, Teams, etc.)</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Address (if presencial) */}
          {formData.location === "presencial" && (
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Digite o endereço completo"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Adicione informações relevantes sobre o agendamento..."
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || !formData.date || !formData.time}
              className="flex-1 bg-stone-green-light hover:bg-stone-green-dark"
            >
              {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
