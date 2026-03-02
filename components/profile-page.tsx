"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit,
  MapPin,
  Mail,
  Camera,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRef } from "react"
import { useAuth } from "@/lib/hooks/use-auth"

export function ProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user: authUser, logout, isLoading } = useAuth()

  const user = {
    name: authUser?.name || "Usuario FLASHPLAN",
    nickname: authUser?.nickname || "@flashuser",
    email: authUser?.email || "usuario@flashplan.com",
    location: authUser?.location || "Madrid, Espana",
    age: authUser?.age || "",
    avatar: authUser?.avatar || "/placeholder.svg?height=120&width=120",
    joinedDate: authUser?.joinedDate || "Enero 2026",
    totalPlans: authUser?.totalPlans || 0,
    upcomingPlans: authUser?.upcomingPlans || 0,
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no puede superar los 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = async () => {
        const newAvatar = reader.result as string
        await fetch("/api/user/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: authUser?.firstName || "",
            lastName: authUser?.lastName || "",
            location: authUser?.location || "",
            age: authUser?.age || "",
            avatar: newAvatar,
          }),
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogout = () => {
    if (confirm("Estas seguro de que quieres cerrar sesion?")) {
      logout()
    }
  }

  const handleEditProfile = () => {
    router.push("/complete-profile")
  }

  const handleChangePhoto = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const menuItems = [
    {
      icon: Calendar,
      label: "Mis planes",
      description: `${user.upcomingPlans} planes próximos`,
      href: "/my-plans",
      color: "text-accent",
    },
    {
      icon: Settings,
      label: "Configuración",
      description: "Preferencias de la cuenta",
      href: "/settings",
      color: "text-primary",
    },
    {
      icon: Bell,
      label: "Notificaciones",
      description: "Gestionar alertas",
      href: "/notifications",
      color: "text-accent",
    },
    {
      icon: HelpCircle,
      label: "Ayuda y Soporte",
      description: "Centro de ayuda",
      href: "/help",
      color: "text-primary",
    },
  ]

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="w-10 h-10 text-foreground hover:text-accent transition-all active-scale touch-target"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">Mi Perfil</h1>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <Card className="p-4 sm:p-6 bg-card border-border">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-3">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-3 border-accent">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                onClick={handleChangePhoto}
                className="absolute bottom-0 right-0 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground w-8 h-8 transition-all active-scale touch-target"
              >
                <Camera className="w-3.5 h-3.5" />
              </Button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <Button
                size="icon"
                onClick={handleEditProfile}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground w-8 h-8 transition-all active-scale touch-target"
              >
                <Edit className="w-3.5 h-3.5" />
              </Button>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-0.5">{user.name}</h2>
            <p className="text-accent font-semibold text-sm mb-3">{user.nickname}</p>

            <div className="space-y-1.5 w-full max-w-xs">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location}</span>
              </div>
              {user.age && (
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{user.age} años</span>
                </div>
              )}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Miembro desde {user.joinedDate}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user.totalPlans}</p>
              <p className="text-xs text-muted-foreground">Planes realizados</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user.upcomingPlans}</p>
              <p className="text-xs text-muted-foreground">Planes próximos</p>
            </div>
          </div>
        </Card>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Card className="p-3 bg-card border-border active-scale transition-all cursor-pointer touch-target">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center ${item.color}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-sm">{item.label}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="p-3 bg-card border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 transition-all active-scale h-auto p-0 touch-target"
          >
            <div className="flex items-center gap-3 w-full py-1">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <h3 className="font-bold text-sm">Cerrar Sesión</h3>
                <p className="text-xs text-muted-foreground">Salir de tu cuenta</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </div>
          </Button>
        </Card>
      </div>
    </div>
  )
}
