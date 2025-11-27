"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Script from "next/script"

const LINKTREE_LINK = "https://linktr.ee/ImpulsoStone"
const REDIRECT_DELAY = 5000 // 5 segundos

export default function CadastroFeitoPage() {
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    // Contagem regressiva
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirecionamento automático após 5 segundos
    const redirectTimeout = setTimeout(() => {
      setIsRedirecting(true)
      window.location.href = LINKTREE_LINK
    }, REDIRECT_DELAY)

    return () => {
      clearInterval(interval)
      clearTimeout(redirectTimeout)
    }
  }, [])

  const handleManualRedirect = () => {
    setIsRedirecting(true)
    window.location.href = LINKTREE_LINK
  }

  return (
    <>
      <Script id="gtm-cadastro-feito" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KGDN9M55');`}
      </Script>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-green-dark via-stone-green-light to-stone-green-bright relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black/5"></div>

        {/* Animated circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-2xl px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 md:p-12 animate-fade-in">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-stone-green-light rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Obrigado por fazer seu cadastro no Programa Impulso 💚
            </h1>

            {/* Description */}
            <p className="text-lg text-center text-gray-600 mb-8">
              Aqui está o link com tudo que você pode acessar no Programa Impulso:
            </p>

            {/* Button */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={handleManualRedirect}
                disabled={isRedirecting}
                className="w-full md:w-auto min-w-[280px] h-14 bg-gradient-to-r from-stone-green-dark via-stone-green-light to-stone-green-bright hover:from-stone-green-bright hover:via-stone-green-light hover:to-stone-green-dark text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border-0"
              >
                {isRedirecting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Redirecionando...</span>
                  </div>
                ) : (
                  "Acessar conteúdo do Programa"
                )}
              </Button>

              {/* Countdown message */}
              {countdown > 0 && (
                <p className="text-sm text-gray-500 text-center animate-fade-in">
                  Você será redirecionado automaticamente em {countdown} segundo{countdown !== 1 ? 's' : ''}...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
