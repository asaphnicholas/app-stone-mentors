import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { ToastProvider } from "@/components/ui/toast"
import { NotificationProvider } from "@/contexts/notification-context"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-poppins",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Impulso Stone Mentors",
  description: "Plataforma de mentoria para empreendedores",
  generator: "Impulso Stone Mentors",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>
          <NotificationProvider>
            <AuthProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </AuthProvider>
          </NotificationProvider>
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
