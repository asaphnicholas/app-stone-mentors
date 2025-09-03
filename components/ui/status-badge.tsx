import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "ativo" | "inativo" | "pendente" | "aguardando" | "em-mentoria" | "finalizado"
  className?: string
}

const statusConfig = {
  ativo: {
    label: "Ativo",
    className: "bg-stone-green-light text-white hover:bg-stone-green-light/80",
  },
  inativo: {
    label: "Inativo",
    className: "bg-muted text-muted-foreground hover:bg-muted/80",
  },
  pendente: {
    label: "Pendente",
    className: "bg-yellow-500 text-white hover:bg-yellow-500/80",
  },
  aguardando: {
    label: "Aguardando",
    className: "bg-yellow-500 text-white hover:bg-yellow-500/80",
  },
  "em-mentoria": {
    label: "Em Mentoria",
    className: "bg-blue-500 text-white hover:bg-blue-500/80",
  },
  finalizado: {
    label: "Finalizado",
    className: "bg-stone-green-dark text-white hover:bg-stone-green-dark/80",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge className={cn(config.className, className)}>{config.label}</Badge>
}
