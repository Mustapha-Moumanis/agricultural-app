"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, X, CheckCircle, AlertTriangle, Info } from "lucide-react"
import type { Notification } from "@/types"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Alert in Your Area",
      message: "Aphid infestation detected 2.3km from your location",
      time: "5 min ago",
      isNew: true,
      type: "alert",
    },
    {
      id: "2",
      title: "Weather Update",
      message: "Optimal planting conditions expected tomorrow",
      time: "1 hour ago",
      isNew: true,
      type: "weather",
    },
    {
      id: "3",
      title: "Alert Saved",
      message: "Fungal disease alert has been saved to your list",
      time: "2 hours ago",
      isNew: false,
      type: "system",
    },
    {
      id: "4",
      title: "Frost Warning",
      message: "Temperature dropping to -2°C tonight. Protect sensitive crops.",
      time: "3 hours ago",
      isNew: false,
      type: "alert",
    },
    {
      id: "5",
      title: "Profile Updated",
      message: "Your profile information has been successfully updated",
      time: "1 day ago",
      isNew: false,
      type: "system",
    },
  ])

  const unreadCount = notifications.filter((n) => n.isNew).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "weather":
        return <Info className="w-4 h-4 text-blue-500" />
      case "system":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string, isNew: boolean) => {
    if (!isNew) return ""

    switch (type) {
      case "alert":
        return "bg-red-50 dark:bg-red-950/50 border-l-4 border-l-red-500"
      case "weather":
        return "bg-blue-50 dark:bg-blue-950/50 border-l-4 border-l-blue-500"
      case "system":
        return "bg-green-50 dark:bg-green-950/50 border-l-4 border-l-green-500"
      default:
        return "bg-gray-50 dark:bg-gray-950/50"
    }
  }

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          {/* Mobile overlay */}
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)} />

          <Card className="absolute right-0 top-12 w-80 z-50 shadow-xl">
            <CardHeader className="border-b pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Notifications</CardTitle>
                  <CardDescription>
                    {unreadCount > 0 ? `You have ${unreadCount} new notifications` : "All caught up!"}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="max-h-80 md:max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`
                        p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors
                        ${getNotificationColor(notification.type, notification.isNew)}
                      `}
                      onClick={() => {
                        // Handle notification click
                        console.log("Notification clicked:", notification.id)
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm text-foreground line-clamp-1">{notification.title}</h4>
                            {notification.isNew && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{notification.message}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div className="p-3 border-t bg-muted/30">
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1 text-sm h-8" size="sm">
                      Mark All Read
                    </Button>
                    <Button variant="ghost" className="flex-1 text-sm h-8" size="sm">
                      View All
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
