"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, MapPin, Users, Heart, Share2, Calendar, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

interface PlanDetailsProps {
  planId: string
}

interface Plan {
  id: string
  name: string
  category: string
  distance: number
  attendees: number
  price: number
  time: string
  date: string
  location: string
  address: string
  description: string
  image: string
  organizer: string
  capacity: number
  latitude: number
  longitude: number
}

const plansDatabase: Record<string, Plan> = {
  "1": {
    id: "1",
    name: "Concierto Jazz en Vivo",
    category: "Música",
    distance: 0.8,
    attendees: 45,
    price: 15,
    time: "19:30",
    date: "Hoy, 9 de Enero",
    location: "Jazz Club Central",
    address: "Calle Mayor 123, Madrid",
    description:
      "Disfruta de una velada excepcional con los mejores músicos de jazz de la ciudad. Una experiencia íntima en un ambiente acogedor con cócteles artesanales y buena compañía.",
    image: "/jazz-concert-live.jpg",
    organizer: "Jazz Club Central",
    capacity: 80,
    latitude: 40.4168,
    longitude: -3.7038,
  },
  "2": {
    id: "2",
    name: "Trattoria La Nonna",
    category: "Gastronomía",
    distance: 1.2,
    attendees: 28,
    price: 25,
    time: "20:00",
    date: "Hoy, 9 de Enero",
    location: "Trattoria La Nonna",
    address: "Calle de la Luna 45, Madrid",
    description:
      "Auténtica cocina italiana con mesas disponibles. Pasta fresca hecha al momento, pizzas artesanales y los mejores vinos italianos en un ambiente familiar.",
    image: "/italian-restaurant-cozy.jpg",
    organizer: "Trattoria La Nonna",
    capacity: 50,
    latitude: 40.4215,
    longitude: -3.7095,
  },
  "3": {
    id: "3",
    name: "Escape Room Espacial",
    category: "Entretenimiento",
    distance: 2.5,
    attendees: 12,
    price: 20,
    time: "18:00",
    date: "Hoy, 9 de Enero",
    location: "Mystery Box Madrid",
    address: "Gran Vía 78, Madrid",
    description:
      "Vive una aventura intergaláctica resolviendo puzzles y acertijos en nuestra sala temática espacial. Perfecto para grupos de 2-6 personas.",
    image: "/escape-room-space-theme.jpg",
    organizer: "Mystery Box Madrid",
    capacity: 24,
    latitude: 40.4203,
    longitude: -3.7058,
  },
  "4": {
    id: "4",
    name: "Yoga al Atardecer",
    category: "Bienestar",
    distance: 1.8,
    attendees: 35,
    price: 0,
    time: "20:30",
    date: "Hoy, 9 de Enero",
    location: "Parque del Retiro",
    address: "Paseo de la Argentina, Madrid",
    description:
      "Sesión gratuita de yoga al aire libre con vistas al atardecer. Trae tu esterilla y disfruta de una hora de relajación y conexión con la naturaleza.",
    image: "/sunset-yoga-park.jpg",
    organizer: "Yoga Madrid Community",
    capacity: 60,
    latitude: 40.4153,
    longitude: -3.6845,
  },
}

export function PlanDetailsPage({ planId }: PlanDetailsProps) {
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)

  const planDetails = plansDatabase[planId] || plansDatabase["1"]

  useEffect(() => {
    const myPlans = JSON.parse(localStorage.getItem("flashplan_my_plans") || "[]")
    const alreadyJoined = myPlans.some((plan: Plan) => plan.id === planId)
    setHasJoined(alreadyJoined)

    // Check if it's a favorite
    const favorites = JSON.parse(localStorage.getItem("flashplan_favorites") || "[]")
    setIsFavorite(favorites.includes(planId))
  }, [planId])

  const handleToggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("flashplan_favorites") || "[]")
    let newFavorites
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== planId)
    } else {
      newFavorites = [...favorites, planId]
    }
    localStorage.setItem("flashplan_favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
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
    setIsJoining(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get current plans from localStorage
    const myPlans = JSON.parse(localStorage.getItem("flashplan_my_plans") || "[]")

    // Add new plan if not already joined
    const alreadyJoined = myPlans.some((plan: Plan) => plan.id === planId)
    if (!alreadyJoined) {
      const newPlan = {
        id: planDetails.id,
        title: planDetails.name,
        location: planDetails.location,
        address: planDetails.address,
        distance: `${planDetails.distance} km`,
        time: planDetails.time,
        date: planDetails.date,
        image: planDetails.image,
        status: "upcoming",
        category: planDetails.category,
        price: planDetails.price,
        latitude: planDetails.latitude,
        longitude: planDetails.longitude,
        joinedAt: new Date().toISOString(),
      }
      myPlans.push(newPlan)
      localStorage.setItem("flashplan_my_plans", JSON.stringify(myPlans))
    }

    setHasJoined(true)
    setIsJoining(false)

    setTimeout(() => {
      alert("¡Te has unido al plan exitosamente! Puedes verlo en tu perfil.")
    }, 100)
  }

  const handleOpenMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${planDetails.latitude},${planDetails.longitude}`
    window.open(mapsUrl, "_blank")
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
