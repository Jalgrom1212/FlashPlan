"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowRight, User, MapPin, Calendar, Upload, X } from "lucide-react"
import Image from "next/image"
import { useAuth } from "@/lib/hooks/use-auth"

export function CompleteProfilePage() {
  const router = useRouter()
  const { user, mutate } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    location: "",
    age: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no puede superar los 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        console.log("[v0] Profile image uploaded")
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setProfileImage(null)
    console.log("[v0] Profile image removed")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.firstName || !formData.lastName || !formData.location || !formData.age) {
      alert("Por favor, completa todos los campos")
      return
    }

    if (Number.parseInt(formData.age) < 18 || Number.parseInt(formData.age) > 100) {
      alert("La edad debe estar entre 18 y 100 años")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          location: formData.location,
          age: formData.age,
          avatar: profileImage || "",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Error al guardar el perfil")
        setIsLoading(false)
        return
      }

      await mutate()
      setIsLoading(false)
      router.push("/welcome")
    } catch {
      alert("Error de conexion. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-[#2E1760] to-primary">
      <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm border-primary/30">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-20 h-20 mb-4">
            <Image src="/images/flashplan.png" alt="FLASHPLAN Logo" fill className="object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider mb-2">Completa tu perfil</h1>
          <p className="text-sm text-muted-foreground text-center">
            Solo unos datos más para personalizar tu experiencia
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Foto de perfil (opcional)
            </Label>

            {profileImage ? (
              <div className="relative w-32 h-32 mx-auto">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt="Profile preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-accent"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-dashed border-accent flex items-center justify-center">
                  <Upload className="w-8 h-8 text-accent" />
                </div>
                <label
                  htmlFor="profileImage"
                  className="cursor-pointer px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-all text-sm font-medium"
                >
                  Subir imagen
                </label>
                <input id="profileImage" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <p className="text-xs text-muted-foreground">JPG, PNG o GIF (máx. 5MB)</p>
              </div>
            )}
          </div>

          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Nombre
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Tu nombre"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-accent" />
              Apellidos
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Tus apellidos"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" />
              Ubicación
            </Label>
            <Input
              id="location"
              name="location"
              type="text"
              placeholder="Ciudad, País"
              value={formData.location}
              onChange={handleChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
            />
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              Edad
            </Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Tu edad"
              min="18"
              max="100"
              value={formData.age}
              onChange={handleChange}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-accent transition-colors"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold disabled:opacity-50 transition-all group"
          >
            {isLoading ? (
              "GUARDANDO..."
            ) : (
              <span className="flex items-center justify-center gap-2">
                COMENZAR A EXPLORAR
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">Puedes actualizar esta información más tarde desde tu perfil</p>
        </div>
      </Card>
    </div>
  )
}
