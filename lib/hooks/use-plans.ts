import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePlans(filters?: {
  category?: string
  search?: string
  maxDistance?: string
}) {
  const params = new URLSearchParams()
  if (filters?.category) params.set("category", filters.category)
  if (filters?.search) params.set("search", filters.search)
  if (filters?.maxDistance) params.set("maxDistance", filters.maxDistance)

  const queryString = params.toString()
  const url = `/api/plans${queryString ? `?${queryString}` : ""}`

  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    plans: data?.plans || [],
    isLoading,
    error,
    mutate,
  }
}

export function usePlan(planId: string) {
  const { data, error, isLoading } = useSWR(
    planId ? `/api/plans/${planId}` : null,
    fetcher,
  )

  return {
    plan: data?.plan || null,
    isLoading,
    error,
  }
}
