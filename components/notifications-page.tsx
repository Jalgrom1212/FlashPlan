"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bell, Clock, MapPin, Heart, MessageCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/lib/hooks/use-notifications"

const iconMap: Record<string, typeof Clock> = {
  plan: Clock,
  favorite: Heart,
  reminder: Bell,
  new: MapPin,
  social: MessageCircle,
}

export function NotificationsPage() {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleDelete = (id: string) => {
    deleteNotification(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead()
  }

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
          {notifications.map((notification) => {
            const IconComponent = iconMap[notification.type] || Bell
            return (
            <Card
              key={notification._id}
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
                  <IconComponent
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
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="h-auto p-0 text-xs text-accent hover:text-accent"
                      >
                        Marcar como leida
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(notification._id)}
                      className="h-auto p-0 text-xs text-destructive hover:text-destructive ml-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}))}
        </div>
      </div>
    </div>
  )
}
