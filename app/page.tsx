"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "@/components/login-page"

export default function Home() {
  const router = useRouter()

  // Check if user is logged in
  // For now, we'll show the login page
  // TODO: Implement authentication check
  const isLoggedIn = false

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/explore")
    }
  }, [isLoggedIn, router])

  return <LoginPage />
}
