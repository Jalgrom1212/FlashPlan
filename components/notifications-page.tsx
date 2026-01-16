"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Clock, MapPin, Heart, MessageCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "plan",
      icon: Clock,
      title: "¡Plan disponible cerca!",
      message: "Concierto de Jazz en Café Central - En 45 min",
      time: "Hace 5 min",
      read: false,
    },
    {
      id: 2,
      type: "favorite",
      icon: Heart,
      title: "Plan favorito disponible",
      message: "Tu restaurante favorito La Taverna tiene mesa libre",
      time: "Hace 20 min",
      read: false,
    },
    {
      id: 3,
      type: "reminder",
      icon: Bell,
      title: "Recordatorio de plan",
      message: "Tu plan de Yoga al Atardecer empieza en 2 horas",
      time: "Hace 1 hora",
      read: true,
    },
    {
      id: 4,
      type: "new",
      icon: MapPin,
      title: "Nuevos planes en tu zona",
      message: "3 planes nuevos disponibles en Madrid Centro",
      time: "Hace 2 horas",
      read: true,
    },
    {
      id: 5,
      type: "social",
      icon: MessageCircle,
      title: "Plan compartido",
      message: "María ha compartido un plan contigo",
      time: "Hace 3 horas",
      read: true,
    },
  ])

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
    console.log("[v0] Notification marked as read:", id)
  }

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
    console.log("[v0] Notification deleted:", id)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
    console.log("[v0] All notifications marked as read")
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="text-foreground hover:text-accent transition-all hover:scale-110"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-foreground">Notificaciones</h1>
                {unreadCount > 0 && <p className="text-sm text-accent">{unreadCount} sin leer</p>}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} className="text-accent hover:text-accent">
                Marcar todas
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 bg-card border-border transition-all hover:shadow-lg ${
                !notification.read ? "border-l-4 border-l-accent" : ""
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !notification.read ? "bg-accent/20" : "bg-muted"
                  }`}
                >
                  <notification.icon
                    className={`w-6 h-6 ${!notification.read ? "text-accent" : "text-muted-foreground"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-bold ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <Badge className="bg-accent text-accent-foreground flex-shrink-0">Nuevo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="h-auto p-0 text-xs text-accent hover:text-accent"
                      >
                        Marcar como leída
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                      className="h-auto p-0 text-xs text-destructive hover:text-destructive ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
