import { cookies } from "next/headers"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import crypto from "crypto"

const SESSION_COOKIE_NAME = "flashplan_session"
const SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days in seconds

export async function createSession(userId: string): Promise<string> {
  const db = await getDb()
  const sessionToken = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000)

  await db.collection("sessions").insertOne({
    token: sessionToken,
    userId: new ObjectId(userId),
    expiresAt,
    createdAt: new Date(),
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })

  return sessionToken
}

export async function getSession(): Promise<{ userId: string } | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) return null

  const db = await getDb()
  const session = await db.collection("sessions").findOne({
    token: sessionToken,
    expiresAt: { $gt: new Date() },
  })

  if (!session) return null

  return { userId: session.userId.toString() }
}

export async function getCurrentUser() {
  const session = await getSession()
  if (!session) return null

  const db = await getDb()
  const user = await db.collection("users").findOne(
    { _id: new ObjectId(session.userId) },
    { projection: { passwordHash: 0 } }
  )

  if (!user) return null

  return {
    _id: user._id.toString(),
    email: user.email,
    name: user.name || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    nickname: user.nickname || "",
    location: user.location || "",
    age: user.age || "",
    avatar: user.avatar || "",
    joinedDate: user.joinedDate || "",
    totalPlans: user.totalPlans || 0,
    upcomingPlans: user.upcomingPlans || 0,
    profileCompleted: user.profileCompleted || false,
    settings: user.settings || {
      notifications: true,
      locationServices: true,
      emailUpdates: false,
      showDistance: true,
      autoRefresh: true,
      theme: "dark",
      language: "es",
    },
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (sessionToken) {
    const db = await getDb()
    await db.collection("sessions").deleteOne({ token: sessionToken })
  }

  cookieStore.delete(SESSION_COOKIE_NAME)
}
