"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

export interface Notification {
  id: string
  type: "new-business" | "reminder" | "checkout-pending" | "feedback-received" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  priority: "low" | "medium" | "high"
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Mock notifications for demonstration
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "new-business",
    title: "Novo negócio atribuído",
    message: "Padaria do Bairro foi atribuída a você",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
    actionUrl: "/mentor/mentorias",
    priority: "high",
  },
  {
    id: "2",
    type: "reminder",
    title: "Mentoria em 1 hora",
    message: "Mentoria com Tech Startup às 15:00",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    read: false,
    actionUrl: "/mentor/mentorias",
    priority: "medium",
  },
  {
    id: "3",
    type: "checkout-pending",
    title: "Check-out pendente",
    message: "Finalize a mentoria com Loja de Roupas Fashion",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionUrl: "/mentor/checkout/3",
    priority: "high",
  },
  {
    id: "4",
    type: "feedback-received",
    title: "Feedback recebido",
    message: "Restaurante Familiar avaliou sua mentoria com NPS 9",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    priority: "low",
  },
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications for demo
      if (Math.random() < 0.1) {
        // 10% chance every 30 seconds
        const types: Notification["type"][] = ["reminder", "feedback-received", "system"]
        const randomType = types[Math.floor(Math.random() * types.length)]

        addNotification({
          type: randomType,
          title: "Nova notificação",
          message: "Esta é uma notificação de demonstração",
          priority: "medium",
        })
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
