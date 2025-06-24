"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Check, CheckCheck, Trash2, Settings, AlertTriangle, Clock, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { notificationsApi } from "@/lib/api"
import type { Notification } from "@/types"
import { toast } from "sonner"

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread" | "alerts">("all")

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationsApi.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error("Failed to load notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsApi.markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === notificationId ? { ...notif, isRead: true } : notif)),
      )
    } catch (error) {
      toast.error("Failed to mark as read")
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      toast.error("Failed to mark all as read")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsApi.deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId))
      toast.success("Notification deleted")
    } catch (error) {
      toast.error("Failed to delete notification")
    }
  }

  const filteredNotifications = notifications.filter((notif) => {
    switch (filter) {
      case "unread":
        return !notif.isRead
      case "alerts":
        return notif.type === "alert"
      default:
        return true
    }
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-end p-4 z-50">
      <Card className="w-full max-w-md h-[80vh] flex flex-col bg-white/95 backdrop-blur-xl">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mt-3">
            {[
              { key: "all", label: "All" },
              { key: "unread", label: "Unread" },
              { key: "alerts", label: "Alerts" },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(tab.key as any)}
                className="h-8"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="flex-1">
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-0">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground text-sm">
                {filter === "unread"
                  ? "All caught up! No unread notifications."
                  : "You'll see notifications here when they arrive."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case "weather":
        return <span className="text-blue-500">🌤️</span>
      case "system":
        return <Settings className="w-4 h-4 text-gray-500" />
      default:
        return <Bell className="w-4 h-4 text-blue-500" />
    }
  }

  const timeAgo = () => {
    const now = new Date()
    const created = new Date(notification.createdAt)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return created.toLocaleDateString()
  }

  return (
    <div
      className={cn(
        "p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
        !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn("text-sm font-medium leading-tight", !notification.isRead && "font-semibold")}>
              {notification.title}
            </h4>

            <div className="flex items-center gap-1 flex-shrink-0">
              {!notification.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onMarkAsRead(notification.id)}
                  className="h-6 w-6 p-0"
                  title="Mark as read"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notification.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{timeAgo()}</span>

            {notification.severity && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  notification.severity === "critical" && "border-red-300 text-red-700",
                  notification.severity === "high" && "border-orange-300 text-orange-700",
                  notification.severity === "medium" && "border-yellow-300 text-yellow-700",
                  notification.severity === "low" && "border-green-300 text-green-700",
                )}
              >
                {notification.severity}
              </Badge>
            )}
          </div>

          {notification.actionUrl && (
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 mt-2 text-blue-600 hover:text-blue-700"
              onClick={() => window.open(notification.actionUrl, "_blank")}
            >
              View Details →
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Hook for managing notification state
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()

    // Set up real-time notifications if supported
    if ("serviceWorker" in navigator && "PushManager" in window) {
      requestNotificationPermission()
    }
  }, [])

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications()
      setNotifications(data)
      setUnreadCount(data.filter((n) => !n.isRead).length)
    } catch (error) {
      console.error("Failed to load notifications:", error)
    }
  }

  const requestNotificationPermission = async () => {
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        toast.success("Notifications enabled!")
      }
    }
  }

  const showBrowserNotification = (notification: Notification) => {
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        tag: notification.id,
      })
    }
  }

  return {
    notifications,
    unreadCount,
    loadNotifications,
    showBrowserNotification,
  }
}
