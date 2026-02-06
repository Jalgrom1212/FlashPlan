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

    if (password.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    const db = await getDb()
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json({ error: "Ya existe una cuenta con este correo" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const result = await db.collection("users").insertOne({
      email: email.toLowerCase(),
      passwordHash,
      name: "",
      firstName: "",
      lastName: "",
      nickname: "",
      location: "",
      age: "",
      avatar: "",
      joinedDate: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
      totalPlans: 0,
      upcomingPlans: 0,
      profileCompleted: false,
      settings: {
        notifications: true,
        locationServices: true,
        emailUpdates: false,
        showDistance: true,
        autoRefresh: true,
        theme: "dark",
        language: "es",
      },
      createdAt: new Date(),
    })

    await createSession(result.insertedId.toString())

    return NextResponse.json({
      success: true,
      profileCompleted: false,
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
