import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import crypto from "crypto"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: "Email requerido" }, { status: 400 })

    const db = await getDb()
    const user = await db.collection("users").findOne({ email: email.toLowerCase() })

    // don't leak whether user exists
    if (!user) return NextResponse.json({ success: true })

    const secret = process.env.RESET_PASSWORD_SECRET || "dev-reset-secret"
    const expires = Date.now() + 1000 * 60 * 60 // 1 hour
    const payload = `${user._id.toString()}:${expires}`
    const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex")
    const token = Buffer.from(`${payload}:${hmac}`).toString("base64url")

    // prepare mail transporter (expects SMTP env vars)
    const host = process.env.SMTP_HOST
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
    const userName = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS

    if (!host || !port || !userName || !pass) {
      console.error("SMTP no configurado: setear SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS")
      return NextResponse.json({ error: "No configured mailer" }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user: userName, pass },
    })

    const base = process.env.NEXT_PUBLIC_BASE_URL || `http://localhost:3000`
    const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`

    await transporter.sendMail({
      from: process.env.SMTP_FROM || `no-reply@flashplan.app`,
      to: user.email,
      subject: "Recuperación de contraseña - FLASHPLAN",
      html: `<p>Hola,</p><p>Haz clic en el enlace para restablecer tu contraseña (válido 1 hora):</p><p><a href="${resetUrl}">Restablecer contraseña</a></p>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
