"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, Clock, X } from "lucide-react"
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
  ])

  const unreadCount = notifications.filter((n) => n.isNew).length

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
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
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${
                      notification.isNew ? "bg-blue-50 dark:bg-blue-950/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          notification.isNew ? "bg-blue-500" : "bg-muted-foreground/30"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground mb-1">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
