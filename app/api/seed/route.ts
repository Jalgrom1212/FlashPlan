import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

const defaultPlans = [
  {
    id: "1",
    name: "Concierto Jazz en Vivo",
    category: "Musica",
    distance: 0.8,
    attendees: 45,
    price: 15,
    time: "19:30",
    date: "Hoy, 9 de Enero",
    location: "Jazz Club Central",
    address: "Calle Mayor 123, Madrid",
    description:
      "Disfruta de una velada excepcional con los mejores musicos de jazz de la ciudad. Una experiencia intima en un ambiente acogedor con cocteles artesanales y buena compania.",
    image: "/jazz-concert-live.jpg",
    organizer: "Jazz Club Central",
    capacity: 80,
    latitude: 40.4168,
    longitude: -3.7038,
  },
  {
    id: "2",
    name: "Trattoria La Nonna",
    category: "Gastronomia",
    distance: 1.2,
    attendees: 28,
    price: 25,
    time: "20:00",
    date: "Hoy, 9 de Enero",
    location: "Trattoria La Nonna",
    address: "Calle de la Luna 45, Madrid",
    description:
      "Autentica cocina italiana con mesas disponibles. Pasta fresca hecha al momento, pizzas artesanales y los mejores vinos italianos en un ambiente familiar.",
    image: "/italian-restaurant-cozy.jpg",
    organizer: "Trattoria La Nonna",
    capacity: 50,
    latitude: 40.4215,
    longitude: -3.7095,
  },
  {
    id: "3",
    name: "Escape Room Espacial",
    category: "Entretenimiento",
    distance: 2.5,
    attendees: 12,
    price: 20,
    time: "18:00",
    date: "Hoy, 9 de Enero",
    location: "Mystery Box Madrid",
    address: "Gran Via 78, Madrid",
    description:
      "Vive una aventura intergalactica resolviendo puzzles y acertijos en nuestra sala tematica espacial. Perfecto para grupos de 2-6 personas.",
    image: "/escape-room-space-theme.jpg",
    organizer: "Mystery Box Madrid",
    capacity: 24,
    latitude: 40.4203,
    longitude: -3.7058,
  },
  {
    id: "4",
    name: "Yoga al Atardecer",
    category: "Bienestar",
    distance: 1.8,
    attendees: 35,
    price: 0,
    time: "20:30",
    date: "Hoy, 9 de Enero",
    location: "Parque del Retiro",
    address: "Paseo de la Argentina, Madrid",
    description:
      "Sesion gratuita de yoga al aire libre con vistas al atardecer. Trae tu esterilla y disfruta de una hora de relajacion y conexion con la naturaleza.",
    image: "/sunset-yoga-park.jpg",
    organizer: "Yoga Madrid Community",
    capacity: 60,
    latitude: 40.4153,
    longitude: -3.6845,
  },
]

export async function POST() {
  try {
    const db = await getDb()

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("sessions").createIndex({ token: 1 }, { unique: true })
    await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
    await db.collection("favorites").createIndex({ userId: 1, planId: 1 }, { unique: true })
    await db.collection("user_plans").createIndex({ userId: 1, planId: 1 }, { unique: true })
    await db.collection("notifications").createIndex({ userId: 1, createdAt: -1 })
    await db.collection("plans").createIndex({ id: 1 }, { unique: true })
    await db.collection("plans").createIndex({ category: 1 })
    await db.collection("plans").createIndex({ name: "text" })

    // Seed plans if empty
    const existingPlans = await db.collection("plans").countDocuments()
    if (existingPlans === 0) {
      await db.collection("plans").insertMany(defaultPlans)
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
      collections: ["users", "sessions", "plans", "favorites", "user_plans", "notifications"],
      plansSeeded: existingPlans === 0 ? defaultPlans.length : 0,
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "Error al inicializar la base de datos" }, { status: 500 })
  }
}
