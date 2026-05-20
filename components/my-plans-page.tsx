"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Calendar, X, CheckCircle, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useUserPlans } from "@/lib/hooks/use-user-plans"

export function MyPlansPage() {
  const router = useRouter()
  const {
    plans,
    upcomingPlans,
    completedPlans,
    isLoading,
    cancelPlan,
    updatePlanStatus,
  } = useUserPlans()

  const handleCancelPlan = (planId: string) => {
    if (confirm("Estas seguro de que quieres cancelar este plan?")) {
      cancelPlan(planId)
    }
  }

  const handleCompletePlan = (planId: string) => {
    updatePlanStatus(planId, "completed")
  }

  const handleOpenMaps = (latitude: number, longitude: number) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(mapsUrl, "_blank")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    )
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
            <h1 className="text-xl font-bold text-foreground">Mis Planes</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {plans.length === 0 && (
          <Card className="bg-card border-border p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No tienes planes aún</h3>
            <p className="text-muted-foreground mb-4">Explora los planes disponibles y únete a los que más te gusten</p>
            <Button
              onClick={() => router.push("/explore")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Explorar Planes
            </Button>
          </Card>
        )}

        {/* Upcoming Plans */}
        {upcomingPlans.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Próximos Planes ({upcomingPlans.length})</h2>
            <div className="space-y-4">
              {upcomingPlans.map((plan) => (
                <Card key={plan.planId} className="overflow-hidden bg-card border-border hover:shadow-lg transition-all">
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={plan.image || "/placeholder.svg"} alt={plan.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-foreground line-clamp-1">{plan.title}</h3>
                        <Badge className="bg-accent text-accent-foreground flex-shrink-0">{plan.category}</Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <button
                          onClick={() => handleOpenMaps(plan.latitude, plan.longitude)}
                          className="flex items-center gap-2 hover:text-accent transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{plan.location}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{plan.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span className="text-accent font-semibold">{plan.time}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCompletePlan(plan.planId)}
                          className="text-accent border-accent hover:bg-accent/10 transition-all"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completado
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelPlan(plan.planId)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Completed Plans */}
        {completedPlans.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Planes Completados ({completedPlans.length})</h2>
            <div className="space-y-4">
              {completedPlans.map((plan) => (
                <Card key={plan.planId} className="overflow-hidden bg-card border-border opacity-75">
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={plan.image || "/placeholder.svg"}
                        alt={plan.title}
                        fill
                        className="object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-accent" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-foreground line-clamp-1">{plan.title}</h3>
                        <Badge variant="outline" className="flex-shrink-0">
                          {plan.category}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <button
                          onClick={() => handleOpenMaps(plan.latitude, plan.longitude)}
                          className="flex items-center gap-2 hover:text-accent transition-colors"
                        >
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{plan.location}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{plan.date}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelPlan(plan.planId)}
                        className="mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
