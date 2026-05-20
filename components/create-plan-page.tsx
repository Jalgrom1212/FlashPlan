"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/lib/hooks/use-auth"

export function CreatePlanPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [distance, setDistance] = useState("")
  const [time, setTime] = useState("")
  const [date, setDate] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // redirect if not logged in
  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const payload = {
        name,
        category,
        distance: Number(distance),
        time,
        date,
        location,
        address,
        price,
        image,
        latitude,
        longitude,
      }

      const res = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error creando plan")

      // after creation navigate to my plans or explore
      router.push("/my-plans")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-foreground">Crear Plan</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-6">
        <Card className="p-6 bg-card border-border max-w-lg mx-auto">
          {error && <p className="text-destructive mb-2">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Categoría</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Musica">Música</SelectItem>
                  <SelectItem value="Gastronomia">Gastronomía</SelectItem>
                  <SelectItem value="Entretenimiento">Entretenimiento</SelectItem>
                  <SelectItem value="Bienestar">Bienestar</SelectItem>
                  <SelectItem value="Otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Radio de distancia (km)</label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Hora</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Fecha</label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Ubicación</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Dirección (opcional)</label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Precio (€)</label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Adjuntar imagen (opcional, max 1MB)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 1024 * 1024) {
                    setError("La imagen supera 1MB, elige otra más pequeña")
                    return
                  }
                  const reader = new FileReader()
                  reader.onload = () => {
                    setImage(String(reader.result || ""))
                  }
                  reader.readAsDataURL(file)
                }}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!navigator.geolocation) return alert("Geolocalización no disponible")
                  navigator.geolocation.getCurrentPosition(
                    (pos) => {
                      setLatitude(pos.coords.latitude)
                      setLongitude(pos.coords.longitude)
                    },
                    () => alert("No se pudo obtener la ubicación")
                  )
                }}
                className="px-3 py-2 bg-primary text-white rounded"
              >
                Usar mi ubicación
              </button>
              <div className="text-sm text-muted-foreground">{latitude && longitude ? `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}` : "Sin coordenadas"}</div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creando..." : "Crear Plan"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
