"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Search, MessageCircle, Mail, Phone, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function HelpPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Help form submitted:", contactForm)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setContactForm({ name: "", email: "", message: "" })
    }, 3000)
  }

  const faqItems = [
    {
      question: "¿Cómo funciona FLASHPLAN?",
      answer:
        "FLASHPLAN te muestra planes disponibles en las próximas 3 horas cerca de tu ubicación. Solo navega, elige y disfruta.",
    },
    {
      question: "¿Es gratis usar la app?",
      answer:
        "Sí, FLASHPLAN es completamente gratuito. Algunos planes pueden tener costos asociados directamente con los proveedores.",
    },
    {
      question: "¿Cómo activo las notificaciones?",
      answer: "Ve a Configuración > Notificaciones y activa las alertas push para recibir avisos de nuevos planes.",
    },
    {
      question: "¿Puedo cancelar un plan?",
      answer:
        "Sí, ve a Mis Planes y selecciona el plan que deseas cancelar. Algunos planes pueden tener políticas de cancelación específicas.",
    },
  ]

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <h1 className="text-xl font-bold text-foreground">Ayuda y Soporte</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Search FAQ */}
        <Card className="p-4 bg-card border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar en preguntas frecuentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </Card>

        {/* FAQ Section */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Preguntas Frecuentes</h2>
          <div className="space-y-3">
            {filteredFAQ.map((item, index) => (
              <Card key={index} className="p-4 bg-card border-border">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">{item.question}</h3>
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Options */}
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Contáctanos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-foreground">Chat en Vivo</h3>
                <p className="text-sm text-muted-foreground">Respuesta inmediata</p>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Email</h3>
                <p className="text-sm text-muted-foreground">soporte@flashplan.com</p>
              </div>
            </Card>
            <Card className="p-4 bg-card border-border hover:shadow-lg transition-all cursor-pointer">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-foreground">Teléfono</h3>
                <p className="text-sm text-muted-foreground">+34 900 123 456</p>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Envíanos un Mensaje</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Tu nombre"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Tu correo electrónico"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                required
                className="bg-background border-border"
              />
            </div>
            <div>
              <Textarea
                placeholder="Describe tu problema o pregunta..."
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={5}
                className="bg-background border-border resize-none"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={submitted}
            >
              {submitted ? "¡Mensaje Enviado!" : "Enviar Mensaje"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
