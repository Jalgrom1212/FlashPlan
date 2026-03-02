import useSWR from "swr"
import { useAuth } from "./use-auth"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCreatedPlans() {
  const { user } = useAuth()
  const url = user ? `/api/plans?creatorId=${user._id}` : null
  const { data, error, isLoading } = useSWR(url, fetcher)

  return {
    plans: data?.plans || [],
    isLoading,
    error,
  }
}
