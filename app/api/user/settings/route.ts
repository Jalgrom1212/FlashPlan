import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(session.userId) },
      { projection: { settings: 1 } }
    )

    return NextResponse.json({
      settings: user?.settings || {
        notifications: true,
        locationServices: true,
        emailUpdates: false,
        showDistance: true,
        autoRefresh: true,
        theme: "dark",
        language: "es",
      },
    })
  } catch (error) {
    console.error("Settings get error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { settings } = await request.json()
    const db = await getDb()

    await db.collection("users").updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { settings } }
    )

    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error("Settings update error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
