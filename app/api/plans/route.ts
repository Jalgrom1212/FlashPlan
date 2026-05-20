import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import crypto from "crypto"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const maxDistance = searchParams.get("maxDistance")

    const db = await getDb()

    const filter: Record<string, unknown> = {}

    if (category) {
      const categories = category.split(",")
      filter.category = { $in: categories }
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }
    }

    if (maxDistance) {
      filter.distance = { $lte: Number.parseFloat(maxDistance) }
    }

    // allow filtering plans created by a specific user
    const creatorId = searchParams.get("creatorId")
    if (creatorId) {
      // store ObjectId for consistency with database
      try {
        filter.creatorId = { $eq: new ObjectId(creatorId) }
      } catch {
        // ignore invalid id
      }
    }

    const plans = await db.collection("plans").find(filter).sort({ date: 1 }).toArray()

    return NextResponse.json({
      plans: plans.map((plan) => ({
        ...plan,
        _id: plan._id.toString(),
      })),
    })
  } catch (error) {
    console.error("Plans fetch error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// create a new plan (requires authentication)
export async function POST(request: Request) {
  try {
    const session = await (await import("@/lib/session")).getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const planData = await request.json()
    const db = await getDb()

    // construct new document
    const newPlan: Record<string, any> = {
      id: planData.id || crypto.randomUUID(),
      name: planData.name,
      category: planData.category,
      distance: Number(planData.distance) || 0,
      time: planData.time || "",
      date: planData.date || "",
      location: planData.location || "",
      address: planData.address || "",
      image: planData.image || "",
      price: Number(planData.price) || 0,
      attendees: Number(planData.attendees) || 0,
      latitude: Number(planData.latitude) || 0,
      longitude: Number(planData.longitude) || 0,
      creatorId: new ObjectId(session.userId),
      dateCreated: new Date(),
    }

    await db.collection("plans").insertOne(newPlan)

    // also add to the user's own plans list so it shows under "Mis Planes"
    await db.collection("user_plans").insertOne({
      userId: new ObjectId(session.userId),
      planId: newPlan.id,
      title: newPlan.name,
      location: newPlan.location,
      address: newPlan.address,
      distance: newPlan.distance,
      time: newPlan.time,
      date: newPlan.date,
      image: newPlan.image,
      status: "upcoming",
      category: newPlan.category,
      price: newPlan.price,
      latitude: newPlan.latitude,
      longitude: newPlan.longitude,
      joinedAt: new Date(),
    })

    return NextResponse.json({ success: true, plan: { ...newPlan, _id: newPlan._id?.toString() } })
  } catch (error) {
    console.error("Plan creation error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
