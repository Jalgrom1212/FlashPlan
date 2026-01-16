"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Users, Search, Heart, User, Zap, Crosshair, Check } from "lucide-react"
import Link from "next/link"

interface Plan {
  id: string
  name: string
  category: string
  distance: number
  attendees: number
  price: number
  time: string
  location: string
  image: string
  latitude: number
  longitude: number
  isFavorite: boolean
  address: string
  date: string
}

const plansData = [
  {
    id: "1",
    name: "Concierto Jazz en Vivo",
    category: "Música",
    distance: 0.8,
    attendees: 45,
    price: 15,
    time: "19:30",
    location: "Jazz Club Central",
    address: "Calle Mayor 123, Madrid",
    image: "/jazz-concert-live.jpg",
    latitude: 40.4168,
    longitude: -3.7038,
    date: "Hoy, 9 de Enero",
  },
  {
    id: "2",
    name: "Restaurante Italiano Mesa Libre",
    category: "Gastronomía",
    distance: 1.2,
    attendees: 8,
    price: 25,
    time: "20:00",
    location: "Trattoria Bella",
    address: "Calle de la Luna 45, Madrid",
    image: "/italian-restaurant-cozy.jpg",
    latitude: 40.42,
    longitude: -3.705,
    date: "Hoy, 9 de Enero",
  },
  {
    id: "3",
    name: "Escape Room: Misterio Espacial",
    category: "Entretenimiento",
    distance: 2.1,
    attendees: 12,
    price: 18,
    time: "18:45",
    location: "EscapeX",
    address: "Gran Vía 78, Madrid",
    image: "/escape-room-space-theme.jpg",
    latitude: 40.415,
    longitude: -3.708,
    date: "Hoy, 9 de Enero",
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
    address: "Paseo de la Argentina, Madrid",
    image: "/sunset-yoga-park.jpg",
    latitude: 40.4153,
    longitude: -3.6844,
    date: "Hoy, 9 de Enero",
  },
]

export function ExplorePage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [joinedPlans, setJoinedPlans] = useState<string[]>([])
  const [joiningPlan, setJoiningPlan] = useState<string | null>(null)
  const [radarAngle, setRadarAngle] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 2) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const storedFavorites = localStorage.getItem("flashplan_favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    const storedMyPlans = localStorage.getItem("flashplan_my_plans")
    if (storedMyPlans) {
      const myPlans = JSON.parse(storedMyPlans)
      setJoinedPlans(myPlans.map((p: { id: string }) => p.id))
    }
  }, [])

  const plans: Plan[] = plansData.map((plan) => ({
    ...plan,
    isFavorite: favorites.includes(plan.id),
  }))

  const toggleFavorite = (planId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
      localStorage.setItem("flashplan_favorites", JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  const handleQuickJoin = async (e: React.MouseEvent, planId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (joinedPlans.includes(planId)) return

    setJoiningPlan(planId)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const planData = plansData.find((p) => p.id === planId)
    if (planData) {
      const myPlans = JSON.parse(localStorage.getItem("flashplan_my_plans") || "[]")
      const newPlan = {
        id: planData.id,
        title: planData.name,
        location: planData.location,
        address: planData.address,
        distance: `${planData.distance} km`,
        time: planData.time,
        date: planData.date,
        image: planData.image,
        status: "upcoming",
        category: planData.category,
        price: planData.price,
        latitude: planData.latitude,
        longitude: planData.longitude,
        joinedAt: new Date().toISOString(),
      }
      myPlans.push(newPlan)
      localStorage.setItem("flashplan_my_plans", JSON.stringify(myPlans))
      setJoinedPlans((prev) => [...prev, planId])
    }

    setJoiningPlan(null)
  }

  const favoritePlans = plans.filter((plan) => favorites.includes(plan.id))

  const openInGoogleMaps = (plan: Plan) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${plan.latitude},${plan.longitude}`
    window.open(url, "_blank")
  }

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border safe-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              <h1 className="text-lg font-bold text-foreground">FLASHPLAN</h1>
            </div>
            <div className="flex items-center gap-1">
              <Link href="/search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-foreground hover:text-accent transition-all active-scale touch-target"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-foreground hover:text-accent transition-all active-scale relative touch-target"
                >
                  <Heart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute top-1 right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px]">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 text-foreground hover:text-accent transition-all active-scale touch-target"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Planes Disponibles</h2>
            <p className="text-xs text-muted-foreground">Próximas 3 horas cerca de ti</p>
          </div>
          <Badge className="bg-accent text-accent-foreground px-3 py-1.5 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {plans.length} planes
          </Badge>
        </div>

        <Card className="overflow-hidden bg-card border-border">
          <div className="relative h-56 sm:h-72 bg-gradient-to-br from-[#0a0f1a] via-[#1a1f2e] to-[#0f1419] overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                  linear-gradient(to right, rgba(50, 147, 111, 0.3) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(50, 147, 111, 0.3) 1px, transparent 1px)
                `,
                  backgroundSize: "30px 30px",
                }}
              />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <Crosshair className="w-6 h-6 text-accent animate-pulse" />
                <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
              </div>
            </div>

            <div
              className="absolute top-1/2 left-1/2 w-full h-full origin-center"
              style={{
                transform: `translate(-50%, -50%) rotate(${radarAngle}deg)`,
                background: `conic-gradient(from 0deg, transparent 0%, rgba(50, 147, 111, 0.3) 50%, transparent 100%)`,
                transition: "transform 0.05s linear",
              }}
            />

            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20"
                style={{
                  width: `${i * 25}%`,
                  height: `${i * 25}%`,
                }}
              />
            ))}

            {favoritePlans.map((plan, index) => {
              const angle = index * (360 / Math.max(favoritePlans.length, 1)) * (Math.PI / 180)
              const radius = 30 + (index % 3) * 15
              const x = 50 + radius * Math.cos(angle)
              const y = 50 + radius * Math.sin(angle)

              return (
                <button
                  key={plan.id}
                  onClick={() => openInGoogleMaps(plan)}
                  className={`absolute w-9 h-9 rounded-full flex items-center justify-center transition-all active-scale z-10 touch-target ${
                    selectedPlan === plan.id
                      ? "bg-accent scale-125 shadow-lg shadow-accent/50"
                      : "bg-accent/80 hover:bg-accent"
                  }`}
                  style={{
                    top: `${y}%`,
                    left: `${x}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <Heart className="w-4 h-4 text-white fill-white animate-pulse" />
                </button>
              )
            })}

            {plans
              .filter((p) => !favorites.includes(p.id))
              .map((plan, index) => {
                const angle = (index + 45) * (360 / plans.length) * (Math.PI / 180)
                const radius = 25 + (index % 4) * 12
                const x = 50 + radius * Math.cos(angle)
                const y = 50 + radius * Math.sin(angle)

                return (
                  <button
                    key={plan.id}
                    onClick={() => openInGoogleMaps(plan)}
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-all active-scale touch-target ${
                      selectedPlan === plan.id
                        ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                        : "bg-primary/60 hover:bg-primary"
                    }`}
                    style={{
                      top: `${y}%`,
                      left: `${x}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <MapPin className="w-3 h-3 text-white" />
                  </button>
                )
              })}

            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1.5">
                <p className="text-[10px] text-muted-foreground">Modo Satélite</p>
                <p className="text-xs font-bold text-accent flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-accent" />
                  {favoritePlans.length} favoritos
                </p>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1.5">
                <p className="text-[10px] text-muted-foreground">Radar Activo</p>
                <p className="text-xs font-bold text-accent">En Tiempo Real</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/plan/${plan.id}`}>
              <Card
                className={`overflow-hidden transition-all cursor-pointer border active-scale ${
                  selectedPlan === plan.id ? "border-accent shadow-lg" : "border-border"
                }`}
              >
                <div className="relative h-36 sm:h-44">
                  <img src={plan.image || "/placeholder.svg"} alt={plan.name} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(plan.id)
                    }}
                    className="absolute top-2 right-2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center active-scale touch-target"
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${favorites.includes(plan.id) ? "fill-accent text-accent scale-110" : "text-foreground"}`}
                    />
                  </button>
                  <Badge className="absolute bottom-2 left-2 bg-accent text-accent-foreground text-xs">
                    {plan.category}
                  </Badge>
                  {joinedPlans.includes(plan.id) && (
                    <Badge className="absolute top-2 left-2 bg-green-600 text-white text-xs">
                      <Check className="w-3 h-3 mr-1" />
                      Unido
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-base text-foreground mb-1.5 line-clamp-1">{plan.name}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1.5 text-accent flex-shrink-0" />
                      <span className="truncate">
                        {plan.date} a las {plan.time}
                      </span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-3 h-3 mr-1.5 text-accent flex-shrink-0" />
                      <span className="truncate">
                        {plan.location} · {plan.distance} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="w-3 h-3 mr-1.5 text-accent" />
                        <span>{plan.attendees} interesados</span>
                      </div>
                      <div className="font-bold text-foreground text-sm">
                        {plan.price === 0 ? "Gratis" : `${plan.price}€`}
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => handleQuickJoin(e, plan.id)}
                    disabled={joinedPlans.includes(plan.id) || joiningPlan === plan.id}
                    className="w-full mt-3 h-10 bg-accent hover:bg-accent/90 text-accent-foreground font-bold transition-all active-scale disabled:opacity-70 text-sm touch-target"
                  >
                    {joiningPlan === plan.id ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uniéndose...
                      </span>
                    ) : joinedPlans.includes(plan.id) ? (
                      <span className="flex items-center gap-2">
                        <Check className="w-3 h-3" />
                        Te has unido
                      </span>
                    ) : (
                      "Unirse al Plan"
                    )}
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
