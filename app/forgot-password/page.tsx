"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error("Error enviando correo")
      setMessage("Si existe una cuenta con ese correo, recibirás un email para restablecer la contraseña.")
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Recuperar contraseña</h1>
        {message && <p className="mb-4 text-sm text-muted-foreground">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Enviando..." : "Enviar email"}</Button>
            <Button variant="outline" type="button" onClick={() => router.back()}>Volver</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
