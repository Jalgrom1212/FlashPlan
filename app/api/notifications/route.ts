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
    const notifications = await db.collection("notifications").find({
      userId: new ObjectId(session.userId),
    }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        ...n,
        _id: n._id.toString(),
        userId: n.userId.toString(),
      })),
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { notificationId, markAllRead } = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.userId)

    if (markAllRead) {
      await db.collection("notifications").updateMany(
        { userId },
        { $set: { read: true } }
      )
    } else if (notificationId) {
      await db.collection("notifications").updateOne(
        { _id: new ObjectId(notificationId), userId },
        { $set: { read: true } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { notificationId } = await request.json()
    const db = await getDb()

    await db.collection("notifications").deleteOne({
      _id: new ObjectId(notificationId),
      userId: new ObjectId(session.userId),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification delete error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
