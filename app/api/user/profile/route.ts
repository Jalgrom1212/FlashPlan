import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, location, age, avatar } = body

    if (!firstName || !lastName || !location || !age) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 })
    }

    const db = await getDb()
    const nickname = `@${firstName.toLowerCase()}${Math.floor(Math.random() * 1000)}`

    const updateData: Record<string, unknown> = {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      location,
      age,
      nickname,
      profileCompleted: true,
      joinedDate: new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" }),
    }

    if (avatar) {
      updateData.avatar = avatar
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: updateData }
    )

    const updatedUser = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { passwordHash: 0 } }
    )

    return NextResponse.json({
      success: true,
      user: {
        ...updatedUser,
        _id: updatedUser?._id.toString(),
      },
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
