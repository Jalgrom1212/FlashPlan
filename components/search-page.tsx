"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, SlidersHorizontal, Clock, MapPin, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePlans } from "@/lib/hooks/use-plans"

export function SearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDistance, setSelectedDistance] = useState("5")
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [searchFilters, setSearchFilters] = useState<{
    category?: string
    search?: string
    maxDistance?: string
  }>({})
  const { plans: searchResults, isLoading: resultsLoading } = usePlans(
    hasSearched ? searchFilters : undefined
  )

  const categories = ["Música", "Gastronomía", "Entretenimiento", "Bienestar", "Arte", "Deportes", "Networking"]

  const timeSlots = [
    { label: "Mañana", value: "morning", time: "6:00 - 12:00" },
    { label: "Tarde", value: "afternoon", time: "12:00 - 18:00" },
    { label: "Noche", value: "night", time: "18:00 - 24:00" },
  ]

  const distances = [
    { label: "1 km", value: "1" },
    { label: "2 km", value: "2" },
    { label: "5 km", value: "5" },
    { label: "10 km", value: "10" },
    { label: "20 km", value: "20" },
  ]

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newCategories = prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
      console.log("Selected categories:", newCategories)
      return newCategories
    })
  }

  const toggleTimeOfDay = (time: string) => {
    setSelectedTimeOfDay((prev) => {
      const newTimes = prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
      console.log("Selected times:", newTimes)
      return newTimes
    })
  }

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchFilters({
      search: searchQuery || undefined,
      category: selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
      maxDistance: selectedDistance,
    })
    setHasSearched(true)
    setIsSearching(false)
  }

  const clearFilters = () => {
    const hasFilters = searchQuery || selectedCategories.length > 0 || selectedTimeOfDay.length > 0
    if (hasFilters) {
      console.log("Clearing all filters")
    }
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedDistance("5")
    setSelectedTimeOfDay([])
    setHasSearched(false)
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
            <h1 className="text-xl font-bold text-foreground">Buscar Planes</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search Input */}
        <Card className="p-4 bg-card border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nombre del plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </Card>

        {/* Filters Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold text-foreground">Filtros</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-accent transition-all hover:scale-105 active:scale-95"
            >
              Limpiar
            </Button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Categorías</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer transition-all hover:scale-105 active:scale-95 ${
                    selectedCategories.includes(category)
                      ? "bg-accent text-accent-foreground shadow-lg"
                      : "bg-secondary text-secondary-foreground hover:bg-accent/20"
                  }`}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Distancia máxima</h3>
            <div className="flex gap-2">
              {distances.map((distance) => (
                <Button
                  key={distance.value}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedDistance(distance.value)
                    console.log("Selected distance:", distance.value)
                  }}
                  className={`flex-1 transition-all hover:scale-105 active:scale-95 ${
                    selectedDistance === distance.value
                      ? "bg-accent text-accent-foreground border-accent shadow-lg"
                      : "border-border text-foreground hover:bg-accent/10"
                  }`}
                >
                  {distance.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Momento del día</h3>
            <div className="grid grid-cols-1 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.value}
                  onClick={() => toggleTimeOfDay(slot.value)}
                  className={`p-4 rounded-lg border-2 transition-all text-left hover:scale-[1.02] active:scale-98 ${
                    selectedTimeOfDay.includes(slot.value)
                      ? "border-accent bg-accent/10 shadow-lg"
                      : "border-border bg-secondary/20 hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{slot.label}</p>
                      <p className="text-sm text-muted-foreground">{slot.time}</p>
                    </div>
                    <Clock
                      className={`w-5 h-5 ${selectedTimeOfDay.includes(slot.value) ? "text-accent" : "text-muted-foreground"}`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 disabled:opacity-70 transition-all active:scale-98"
        >
          <Search className="w-5 h-5 mr-2" />
          {isSearching ? "BUSCANDO..." : "MOSTRAR PLANES"}
        </Button>

        {/* Results Preview */}
        {hasSearched && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">
              Resultados de busqueda ({searchResults.length})
            </h2>
            <div className="space-y-4">
              {searchResults.length === 0 && !resultsLoading && (
                <Card className="p-8 bg-card border-border text-center">
                  <p className="text-muted-foreground">No se encontraron planes con estos filtros</p>
                </Card>
              )}
              {searchResults.map((plan: { id: string; image: string; name: string; category: string; time: string; distance: number; attendees: number }) => (
                <Link key={plan.id} href={`/plan/${plan.id}`}>
                  <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]">
                    <div className="flex gap-4">
                      <img src={plan.image || "/placeholder.svg"} alt={plan.name} className="w-24 h-24 rounded-lg object-cover" />
                      <div className="flex-1">
                        <Badge className="bg-accent text-accent-foreground mb-2">{plan.category}</Badge>
                        <h3 className="font-bold text-foreground mb-2">{plan.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-accent" />
                            <span>{plan.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span>{plan.distance} km</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-accent" />
                            <span>{plan.attendees}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
