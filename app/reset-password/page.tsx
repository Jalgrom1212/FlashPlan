"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams?.get("token") || ""

  useEffect(() => {
    if (!token) setMessage("Token inválido o ausente")
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) return setMessage("La contraseña debe tener al menos 6 caracteres")
    if (password !== confirm) return setMessage("Las contraseñas no coinciden")
    setLoading(true)
    setMessage("")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Error interno")
      setMessage("Contraseña restablecida correctamente. Inicia sesión.")
      setTimeout(() => router.push("/"), 1500)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Restablecer contraseña</h1>
        {message && <p className="mb-4 text-sm text-muted-foreground">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input type="password" placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Guardando..." : "Restablecer"}</Button>
            <Button variant="outline" type="button" onClick={() => router.back()}>Volver</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
