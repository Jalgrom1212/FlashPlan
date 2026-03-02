'use client';

import useSWR from "swr"
import { useRouter } from "next/navigation"
import { useCallback } from "react"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Not authenticated")
    return res.json()
  })

export function useAuth() {
  const { data, error, isLoading, mutate } = useSWR("/api/auth/me", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  })
  const router = useRouter()

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await mutate()
      return json
    },
    [mutate],
  )

  const register = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      await mutate()
      return json
    },
    [mutate],
  )

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    await mutate(null, { revalidate: false })
    router.push("/")
  }, [mutate, router])

  return {
    user: data?.user || null,
    isLoading,
    isAuthenticated: !!data?.user && !error,
    login,
    register,
    logout,
    mutate,
  }
}
