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
    const favorites = await db.collection("favorites").find({
      userId: new ObjectId(session.userId),
    }).toArray()

    const planIds = favorites.map((f) => f.planId)

    const plans = await db.collection("plans").find({
      id: { $in: planIds },
    }).toArray()

    return NextResponse.json({
      favoriteIds: planIds,
      plans: plans.map((plan) => ({
        ...plan,
        _id: plan._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Favorites fetch error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { planId } = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.userId)

    const existing = await db.collection("favorites").findOne({
      userId,
      planId,
    })

    if (existing) {
      await db.collection("favorites").deleteOne({ userId, planId })
      return NextResponse.json({ action: "removed", planId })
    }

    await db.collection("favorites").insertOne({
      userId,
      planId,
      createdAt: new Date(),
    })

    return NextResponse.json({ action: "added", planId })
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
