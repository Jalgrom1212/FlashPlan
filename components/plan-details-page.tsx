"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, Users, Heart, Share2, Calendar, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePlan } from "@/lib/hooks/use-plans"
import { useFavorites } from "@/lib/hooks/use-favorites"
import { useUserPlans } from "@/lib/hooks/use-user-plans"

interface PlanDetailsProps {
  planId: string
}

export function PlanDetailsPage({ planId }: PlanDetailsProps) {
  const router = useRouter()
  const { plan: planDetails, isLoading } = usePlan(planId)
  const { favoriteIds, toggleFavorite } = useFavorites()
  const { joinedPlanIds, joinPlan } = useUserPlans()
  const [isJoining, setIsJoining] = useState(false)

  const isFavorite = favoriteIds.includes(planId)
  const hasJoined = joinedPlanIds.includes(planId)

  const handleToggleFavorite = () => {
    toggleFavorite(planId)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: planDetails.name,
          text: `¡Únete a este plan en FLASHPLAN! ${planDetails.description.substring(0, 100)}...`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles")
    }
  }

  const handleJoinPlan = async () => {
    if (hasJoined || !planDetails) return
    setIsJoining(true)

    try {
      await joinPlan({
        id: planDetails.id,
        name: planDetails.name,
        location: planDetails.location,
        address: planDetails.address,
        distance: `${planDetails.distance} km`,
        time: planDetails.time,
        date: planDetails.date,
        image: planDetails.image,
        category: planDetails.category,
        price: planDetails.price,
        latitude: planDetails.latitude,
        longitude: planDetails.longitude,
      })
      alert("Te has unido al plan exitosamente! Puedes verlo en tu perfil.")
    } catch {
      alert("Error al unirse al plan. Intenta de nuevo.")
    }

    setIsJoining(false)
  }

  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${planDetails.latitude},${planDetails.longitude}`
    window.open(mapsUrl, "_blank")
  }

  if (isLoading || !planDetails) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-foreground hover:text-accent transition-all hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleFavorite}
                className="text-foreground hover:text-accent transition-all hover:scale-110 active:scale-95"
              >
                <Heart className={`w-5 h-5 transition-all ${isFavorite ? "fill-accent text-accent scale-110" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="text-foreground hover:text-accent transition-all hover:scale-110 active:scale-95"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={planDetails.image || "/placeholder.svg"}
          alt={planDetails.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">{planDetails.category}</Badge>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-24">
        <Card className="bg-card border-border p-6">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground flex-1">{planDetails.name}</h1>
            <div className="text-right ml-4">
              <div className="text-3xl font-bold text-accent">
                {planDetails.price === 0 ? "Gratis" : `${planDetails.price}€`}
              </div>
              <div className="text-xs text-muted-foreground">por persona</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Fecha</p>
                <p className="text-sm font-semibold text-foreground">{planDetails.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hora</p>
                <p className="text-sm font-semibold text-foreground">{planDetails.time}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Distancia</p>
                <p className="text-sm font-semibold text-foreground">{planDetails.distance} km</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Interesados</p>
                <p className="text-sm font-semibold text-foreground">
                  {planDetails.attendees}/{planDetails.capacity}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-6" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-3">Descripción</h2>
            <p className="text-muted-foreground leading-relaxed">{planDetails.description}</p>
          </div>

          {/* Location */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-3">Ubicación</h2>
            <div className="flex items-start gap-3 mb-4">
              <MapPin className="w-5 h-5 text-accent mt-1" />
              <div>
                <p className="font-semibold text-foreground">{planDetails.location}</p>
                <p className="text-sm text-muted-foreground">{planDetails.address}</p>
              </div>
            </div>
            <button
              onClick={handleOpenMaps}
              className="relative w-full h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 hover:opacity-90 transition-all group"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm text-muted-foreground">Toca para abrir en Google Maps</p>
                  <ExternalLink className="w-4 h-4 text-accent mx-auto mt-2" />
                </div>
              </div>
            </button>
          </div>

          {/* Organizer */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-3">Organizador</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{planDetails.organizer}</p>
                <p className="text-sm text-muted-foreground">Organizador verificado</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4">
        <div className="container mx-auto">
          <Button
            onClick={handleJoinPlan}
            disabled={isJoining || hasJoined}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 text-lg disabled:opacity-70 transition-all active:scale-98"
          >
            {isJoining ? "UNIÉNDOSE..." : hasJoined ? "✓ TE HAS UNIDO" : "UNIRSE AL PLAN"}
          </Button>
        </div>
      </div>
    </div>
  )
}
