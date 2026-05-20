import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) return NextResponse.json({ error: "Token y contraseña requeridos" }, { status: 400 })

    const decoded = Buffer.from(token, "base64url").toString()
    const parts = decoded.split(":")
    if (parts.length < 3) return NextResponse.json({ error: "Token inválido" }, { status: 400 })

    const [userId, expiresStr, hmac] = [parts[0], parts[1], parts.slice(2).join(":")]
    const secret = process.env.RESET_PASSWORD_SECRET || "dev-reset-secret"
    const payload = `${userId}:${expiresStr}`
    const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex")
    if (expected !== hmac) return NextResponse.json({ error: "Token inválido" }, { status: 400 })
    if (Date.now() > Number(expiresStr)) return NextResponse.json({ error: "Token expirado" }, { status: 400 })

    const db = await getDb()
    const passwordHash = await bcrypt.hash(password, 12)

    await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { passwordHash } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
