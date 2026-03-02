'use client';

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  })

export function useUserPlans() {
  const { data, error, isLoading, mutate } = useSWR("/api/user/plans", fetcher, {
    revalidateOnFocus: false,
  })

  const joinPlan = useCallback(
    async (planData: Record<string, unknown>) => {
      const res = await fetch("/api/user/plans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      mutate()
      return json
    },
    [mutate],
  )

  const updatePlanStatus = useCallback(
    async (planId: string, status: "upcoming" | "completed") => {
      await fetch("/api/user/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, status }),
      })
      mutate()
    },
    [mutate],
  )

  const cancelPlan = useCallback(
    async (planId: string) => {
      await fetch("/api/user/plans", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      mutate()
    },
    [mutate],
  )

  const plans = data?.plans || []

  return {
    plans,
    joinedPlanIds: plans.map((p: { planId: string }) => p.planId),
    upcomingPlans: plans.filter((p: { status: string }) => p.status === "upcoming"),
    completedPlans: plans.filter((p: { status: string }) => p.status === "completed"),
    isLoading,
    error,
    joinPlan,
    updatePlanStatus,
    cancelPlan,
    mutate,
  }
}
