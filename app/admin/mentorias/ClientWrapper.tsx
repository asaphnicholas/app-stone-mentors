"use client"

import ClientOnly from "@/components/ClientOnly"
import MentoriasContent from "./MentoriasContent"

export default function MentoriasWrapper() {
  return (
    <ClientOnly>
      <MentoriasContent />
    </ClientOnly>
  )
}

