import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

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
