import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Me error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
