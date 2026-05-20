"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginPage } from "@/components/login-page"
import { useAuth } from "@/lib/hooks/use-auth"

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      if (user.profileCompleted) {
        router.push("/explore")
      } else {
        router.push("/complete-profile")
      }
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent" />
      </div>
    )
  }

  if (isAuthenticated) return null

  return <LoginPage />
}
