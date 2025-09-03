"use client"

import { useNotifications as useNotificationContext } from "@/contexts/notification-context"
import { useToast } from "@/components/ui/toast"

export function useNotifications() {
  const notificationContext = useNotificationContext()
  const { addToast } = useToast()

  const showNotificationToast = (notification: any) => {
    const toastType =
      notification.priority === "high" ? "error" : notification.priority === "medium" ? "warning" : "info"

    addToast({
      type: toastType,
      title: notification.title,
      message: notification.message,
    })
  }

  const addNotificationWithToast = (notification: any) => {
    notificationContext.addNotification(notification)
    showNotificationToast({ ...notification, timestamp: new Date(), read: false })
  }

  return {
    ...notificationContext,
    addNotificationWithToast,
    showNotificationToast,
  }
}
