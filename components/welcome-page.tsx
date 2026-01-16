"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sparkles, ArrowRight } from "lucide-react"

export function WelcomePage() {
  const router = useRouter()
  const [userName, setUserName] = useState("Usuario")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.firstName || "Usuario")
    }

    setTimeout(() => setIsVisible(true), 100)

    const timer = setTimeout(() => {
      router.push("/explore")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  const handleContinue = () => {
    router.push("/explore")
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 safe-top safe-bottom bg-gradient-to-br from-background via-[#2E1760] to-primary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-primary/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <Card
        className={`w-full max-w-sm p-6 sm:p-10 bg-card/95 backdrop-blur-sm border-primary/30 relative z-10 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-4 animate-bounce">
            <Image src="/images/flashplan.png" alt="FLASHPLAN Logo" fill className="object-contain" />
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent animate-pulse" />
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-wide text-center">
              Bienvenido {userName}!
            </h1>
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent animate-pulse" />
          </div>

          <p className="text-sm text-muted-foreground text-center mb-1">Estamos listos para encontrar</p>
          <p className="text-base sm:text-lg text-accent font-semibold text-center italic">
            Tu plan perfecto, sin planearlo
          </p>
        </div>

        <div className="space-y-2.5 mb-6">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse flex-shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">Planes disponibles en las próximas 3 horas</p>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-300 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">Geolocalización en tiempo real</p>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-primary/10 border border-accent/20">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse delay-700 flex-shrink-0" />
            <p className="text-xs sm:text-sm text-foreground">Eventos, restaurantes y actividades únicas</p>
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold transition-all group active-scale touch-target"
        >
          <span className="flex items-center justify-center gap-2 text-sm">
            COMENZAR A EXPLORAR
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>

        <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-3">
          Redirigiendo automáticamente en 3 segundos...
        </p>
      </Card>
    </div>
  )
}
