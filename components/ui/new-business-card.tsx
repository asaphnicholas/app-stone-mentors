"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Building2, User } from "lucide-react"

interface Business {
  nome: string
  contato: string
  telefone: string
  segmento: string
  localizacao: string
  tempoFila?: string
}

interface NewBusinessCardProps {
  business: Business
  actions: string[]
  onAction?: (action: string) => void
}

export function NewBusinessCard({ business, actions, onAction }: NewBusinessCardProps) {
  return (
    <Card className="border-2 border-stone-green-light/30 bg-stone-green-light/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-stone-green-dark flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {business.nome}
          </CardTitle>
          <Badge className="bg-stone-green-light text-white">Novo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{business.contato}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{business.telefone}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">{business.segmento}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{business.localizacao}</span>
            </div>
          </div>
        </div>

        {business.tempoFila && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Na fila há:</span> {business.tempoFila}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={index === 0 ? "default" : "outline"}
              className={index === 0 ? "bg-stone-green-light hover:bg-stone-green-dark" : ""}
              onClick={() => onAction?.(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
