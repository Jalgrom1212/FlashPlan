'use client';

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  })

export function useFavorites() {
  const { data, error, isLoading, mutate } = useSWR("/api/favorites", fetcher, {
    revalidateOnFocus: false,
  })

  const toggleFavorite = useCallback(
    async (planId: string) => {
      // Optimistic update
      const currentIds = data?.favoriteIds || []
      const isCurrentlyFavorite = currentIds.includes(planId)
      const newIds = isCurrentlyFavorite
        ? currentIds.filter((id: string) => id !== planId)
        : [...currentIds, planId]

      mutate(
        { ...data, favoriteIds: newIds },
        false,
      )

      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        })
        mutate()
      } catch {
        // Revert on error
        mutate()
      }
    },
    [data, mutate],
  )

  return {
    favoriteIds: (data?.favoriteIds as string[]) || [],
    favoritePlans: data?.plans || [],
    isLoading,
    error,
    toggleFavorite,
    mutate,
  }
}
