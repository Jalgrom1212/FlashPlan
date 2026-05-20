import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { createSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 })
    }

    await createSession(user._id.toString())

    return NextResponse.json({
      success: true,
      profileCompleted: user.profileCompleted || false,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
