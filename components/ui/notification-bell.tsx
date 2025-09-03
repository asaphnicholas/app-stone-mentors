"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/contexts/notification-context"
import { Bell, CheckCheck, Trash2, Building2, Clock, AlertCircle, MessageSquare, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const notificationIcons = {
  "new-business": Building2,
  reminder: Clock,
  "checkout-pending": AlertCircle,
  "feedback-received": MessageSquare,
  system: Info,
}

const notificationColors = {
  "new-business": "text-green-600",
  reminder: "text-yellow-600",
  "checkout-pending": "text-red-600",
  "feedback-received": "text-blue-600",
  system: "text-gray-600",
}

const priorityColors = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-gray-300",
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, removeNotification } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }
    setIsOpen(false)
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return "Agora"
    if (minutes < 60) return `${minutes}m`
    if (hours < 24) return `${hours}h`
    return `${days}d`
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 hover:bg-red-500 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notificações</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2">
                  <CheckCheck className="h-4 w-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-8 px-2">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground mt-1">{unreadCount} não lidas</p>}
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Nenhuma notificação</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type]
                const content = (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer border-l-2",
                      !notification.read && "bg-blue-50/50",
                      priorityColors[notification.priority],
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className={cn("p-1 rounded-full", notificationColors[notification.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                    </div>
                  </div>
                )

                if (notification.actionUrl) {
                  return (
                    <Link key={notification.id} href={notification.actionUrl}>
                      {content}
                    </Link>
                  )
                }

                return content
              })}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-2">
              <Button variant="ghost" className="w-full text-sm" onClick={() => setIsOpen(false)}>
                Ver todas as notificações
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
