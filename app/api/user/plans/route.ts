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
    const userPlans = await db.collection("user_plans").find({
      userId: new ObjectId(session.userId),
    }).sort({ joinedAt: -1 }).toArray()

    return NextResponse.json({
      plans: userPlans.map((p) => ({
        ...p,
        _id: p._id.toString(),
        userId: p.userId.toString(),
      })),
    })
  } catch (error) {
    console.error("User plans fetch error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const planData = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.userId)

    const existing = await db.collection("user_plans").findOne({
      userId,
      planId: planData.id,
    })

    if (existing) {
      return NextResponse.json({ error: "Ya te has unido a este plan" }, { status: 409 })
    }

    await db.collection("user_plans").insertOne({
      userId,
      planId: planData.id,
      title: planData.title || planData.name,
      location: planData.location,
      address: planData.address,
      distance: planData.distance,
      time: planData.time,
      date: planData.date,
      image: planData.image,
      status: "upcoming",
      category: planData.category,
      price: planData.price,
      latitude: planData.latitude,
      longitude: planData.longitude,
      joinedAt: new Date(),
    })

    // Update user's plan counts
    await db.collection("users").updateOne(
      { _id: userId },
      { $inc: { totalPlans: 1, upcomingPlans: 1 } }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Join plan error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { planId, status } = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.userId)

    await db.collection("user_plans").updateOne(
      { userId, planId },
      { $set: { status } }
    )

    if (status === "completed") {
      await db.collection("users").updateOne(
        { _id: userId },
        { $inc: { upcomingPlans: -1 } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update plan error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { planId } = await request.json()
    const db = await getDb()
    const userId = new ObjectId(session.userId)

    const plan = await db.collection("user_plans").findOne({ userId, planId })

    await db.collection("user_plans").deleteOne({ userId, planId })

    if (plan?.status === "upcoming") {
      await db.collection("users").updateOne(
        { _id: userId },
        { $inc: { upcomingPlans: -1, totalPlans: -1 } }
      )
    } else {
      await db.collection("users").updateOne(
        { _id: userId },
        { $inc: { totalPlans: -1 } }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete plan error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
