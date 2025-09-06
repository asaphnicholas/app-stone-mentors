"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faTachometerAlt, 
  faGraduationCap, 
  faComments, 
  faChartLine,
  faUserTie,
  faBell,
  faCog
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/mentor/dashboard", icon: faTachometerAlt, disabled: false },
  { name: "Trilha de Conhecimento", href: "/mentor/trilha-conhecimento", icon: faGraduationCap, disabled: false },
  { name: "Mentorias", href: "/mentor/mentorias", icon: faComments, disabled: false },
  { name: "Desempenho", href: "/mentor/desempenho", icon: faChartLine, disabled: true },
]

interface MentorLayoutProps {
  children: React.ReactNode
}

export function MentorLayout({ children }: MentorLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-gradient-to-b from-stone-green-dark via-stone-green-light to-stone-green-bright transform transition-all duration-300 ease-in-out shadow-2xl",
          !isMounted ? "w-72" : (sidebarCollapsed ? "w-20" : "w-72"),
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-white/20 relative">
            <div className={cn(
              "flex items-center gap-3 transition-all duration-300",
              sidebarCollapsed ? "gap-0" : "gap-3"
            )}>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src="/logo-stone.png"
                  alt="Stone Mentors Logo"
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="text-white">
                  <h1 className="font-bold text-xl">Stone Mentors</h1>
                  <p className="text-xs text-white/80">Plataforma de Mentoria</p>
                </div>
              )}
            </div>
            
            {/* Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft 
                className={cn(
                  "h-3 w-3 text-stone-green-dark transition-transform duration-300",
                  sidebarCollapsed ? "rotate-180" : ""
                )} 
              />
            </button>
          </div>

          {/* User Profile */}
          {/* <div className={cn(
            "px-6 py-6 border-b border-white/20 transition-all duration-300",
            sidebarCollapsed ? "px-3" : "px-6"
          )}>
            <div className={cn(
              "p-3 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300",
              sidebarCollapsed ? "p-2" : "p-3"
            )}>
              <div className={cn(
                "flex items-center gap-3 transition-all duration-300",
                sidebarCollapsed ? "justify-center" : "gap-3"
              )}>
                <Avatar className="h-12 w-12 ring-2 ring-white/20">
                  <AvatarFallback className="bg-white/20 text-white text-lg font-semibold">
                    {user?.nome?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{user?.name}</p>
                    <p className="text-white/80 text-sm truncate">Mentor Sênior</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-white/80">Online</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const isDisabled = item.disabled
              
              if (isDisabled) {
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-not-allowed opacity-50",
                      sidebarCollapsed ? "justify-center px-2" : "px-4"
                    )}
                  >
                    <FontAwesomeIcon 
                      icon={item.icon} 
                      className="h-5 w-5 text-white/40"
                    />
                    {!sidebarCollapsed && (
                      <span className="font-medium text-white/40">{item.name}</span>
                    )}
                    
                    {/* Tooltip for collapsed sidebar */}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name} - Em desenvolvimento
                      </div>
                    )}
                    
                    {/* Tooltip for expanded sidebar */}
                    {!sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name} - Em desenvolvimento
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive 
                      ? "bg-white/20 text-white shadow-lg backdrop-blur-sm transform scale-105" 
                      : "text-white/80 hover:text-white hover:bg-white/10 hover:transform hover:scale-105",
                    sidebarCollapsed ? "justify-center px-2" : "px-4"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <FontAwesomeIcon 
                    icon={item.icon} 
                    className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-white" : "text-white/80 group-hover:text-white"
                    )} 
                  />
                  {!sidebarCollapsed && (
                    <>
                      <span className="font-medium">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </>
                  )}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Bottom Actions */}
          <div className={cn(
            "p-4 space-y-2 transition-all duration-300",
            sidebarCollapsed ? "px-2" : "p-4"
          )}>
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                disabled
                className={cn(
                  "w-full justify-start text-white/40 hover:text-white/40 hover:bg-transparent rounded-xl transition-all duration-200 cursor-not-allowed opacity-50",
                  sidebarCollapsed ? "justify-center px-2" : "justify-start px-4"
                )}
                title={sidebarCollapsed ? "Configurações - Em desenvolvimento" : undefined}
              >
              <FontAwesomeIcon icon={faCog} className="h-4 w-4 mr-3 text-white/40" />
              {!sidebarCollapsed && <span className="text-white/40">Configurações</span>}
              
              {/* Tooltip for collapsed sidebar */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Configurações - Em desenvolvimento
                </div>
              )}
              </Button>
              
              {/* Tooltip for expanded sidebar */}
              {!sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Configurações - Em desenvolvimento
                </div>
              )}
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200",
                sidebarCollapsed ? "justify-center px-2" : "justify-start px-4"
              )}
              title={sidebarCollapsed ? "Sair" : undefined}
            >
              <LogOut className="h-4 w-4 mr-3" />
              {!sidebarCollapsed && "Sair"}
              
              {/* Tooltip for collapsed sidebar */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Sair
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300",
        !isMounted ? "lg:pl-72" : (sidebarCollapsed ? "lg:pl-20" : "lg:pl-72")
      )}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="lg:hidden p-2" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {navigation.find((item) => item.href === pathname)?.name }
              </h1>
              
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="relative p-2">
              <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.nome || "Mentor"}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <Avatar className="h-10 w-10 ring-2 ring-stone-green-light/20">
                <AvatarFallback className="bg-stone-green-light text-white font-semibold">
                  {user?.nome?.charAt(0) || "M"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 bg-gray-50 min-h-[calc(100vh-5rem)]">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  )
}
