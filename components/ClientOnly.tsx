"use client"

import { useState, useEffect } from 'react'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Componente que garante renderização apenas no cliente
 * 
 * Evita problemas de hidratação renderizando um fallback no servidor
 * e só mostra o conteúdo real após a hidratação completa no cliente.
 * 
 * @param children - Conteúdo a ser renderizado apenas no cliente
 * @param fallback - Conteúdo a ser mostrado durante carregamento/hidratação
 */
export default function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
