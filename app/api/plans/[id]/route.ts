import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = await getDb()

    const plan = await db.collection("plans").findOne({ id })

    if (!plan) {
      return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 })
    }

    return NextResponse.json({
      plan: {
        ...plan,
        _id: plan._id.toString(),
      },
    })
  } catch (error) {
    console.error("Plan fetch error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
