"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Share2, Clock, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface FavoritePlan {
  id: string
  name: string
  category: string
  distance: number
  attendees: number
  price: number
  time: string
  location: string
  image: string
}

export function FavoritesPage() {
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoritePlan[]>([
    {
      id: "2",
      name: "Restaurante Italiano Mesa Libre",
      category: "Gastronomía",
      distance: 1.2,
      attendees: 8,
      price: 25,
      time: "20:00",
      location: "Trattoria Bella",
      image: "/italian-restaurant-cozy.jpg",
    },
    {
      id: "4",
      name: "Yoga al Atardecer",
      category: "Bienestar",
      distance: 0.5,
      attendees: 20,
      price: 0,
      time: "19:00",
      location: "Parque del Retiro",
      image: "/sunset-yoga-park.jpg",
    },
  ])

  const removeFavorite = (planId: string) => {
    if (confirm("¿Eliminar este plan de favoritos?")) {
      setFavorites((prev) => prev.filter((plan) => plan.id !== planId))
      console.log("Removed from favorites:", planId)
    }
  }

  const handleShare = async (planId: string) => {
    const plan = favorites.find((p) => p.id === planId)
    if (!plan) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.name,
          text: `¡Mira este plan en FLASHPLAN! ${plan.name}`,
          url: `${window.location.origin}/plan/${planId}`,
        })
        console.log("Shared successfully")
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/plan/${planId}`)
      alert("Enlace copiado al portapapeles")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
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
              <h1 className="text-xl font-bold text-foreground">Planes Favoritos</h1>
              <p className="text-sm text-muted-foreground">{favorites.length} planes guardados</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {favorites.length === 0 ? (
          <Card className="p-12 bg-card border-border text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No tienes planes favoritos</h2>
            <p className="text-muted-foreground mb-6">
              Guarda tus planes favoritos para acceder a ellos fácilmente más tarde
            </p>
            <Link href="/explore">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-105 active:scale-95">
                Explorar Planes
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {favorites.map((plan) => (
              <Card key={plan.id} className="overflow-hidden bg-card border-border">
                <div className="flex gap-4 p-4">
                  <Link href={`/plan/${plan.id}`} className="flex-shrink-0">
                    <img
                      src={plan.image || "/placeholder.svg"}
                      alt={plan.name}
                      className="w-32 h-32 rounded-lg object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <Link href={`/plan/${plan.id}`}>
                        <Badge className="bg-accent text-accent-foreground">{plan.category}</Badge>
                      </Link>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(plan.id)}
                          className="text-foreground hover:text-accent h-8 w-8 transition-all hover:scale-110 active:scale-95"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFavorite(plan.id)}
                          className="text-accent hover:text-destructive h-8 w-8 transition-all hover:scale-110 active:scale-95"
                        >
                          <Heart className="w-4 h-4 fill-accent" />
                        </Button>
                      </div>
                    </div>
                    <Link href={`/plan/${plan.id}`}>
                      <h3 className="font-bold text-lg text-foreground mb-3 line-clamp-2">{plan.name}</h3>
                    </Link>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-accent" />
                        <span>Hoy a las {plan.time}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2 text-accent" />
                        <span>
                          {plan.location} · {plan.distance} km
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground">
                          <Users className="w-4 h-4 mr-2 text-accent" />
                          <span>{plan.attendees} interesados</span>
                        </div>
                        <div className="font-bold text-foreground">
                          {plan.price === 0 ? "Gratis" : `${plan.price}€`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
