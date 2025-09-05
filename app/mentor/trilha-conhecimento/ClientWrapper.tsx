"use client"

import ClientOnly from '@/components/ClientOnly'
import { Card, CardContent } from "@/components/ui/card"

// Componente de Loading que é igual no servidor e cliente
const LoadingState = () => (
  <div className="space-y-6">
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)

// Importação dinâmica do componente da página
import dynamic from 'next/dynamic'

const TrilhaConhecimentoPage = dynamic(
  () => import('./TrilhaConhecimentoContent'),
  { 
    ssr: false,
    loading: () => <LoadingState />
  }
)

export default function TrilhaConhecimentoWrapper() {
  return (
    <ClientOnly fallback={<LoadingState />}>
      <TrilhaConhecimentoPage />
    </ClientOnly>
  )
}
