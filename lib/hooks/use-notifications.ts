'use client';

import useSWR from "swr"
import { useCallback } from "react"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch")
    return res.json()
  })

export function useNotifications() {
  const { data, error, isLoading, mutate } = useSWR("/api/notifications", fetcher, {
    revalidateOnFocus: false,
  })

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      })
      mutate()
    },
    [mutate],
  )

  const markAllAsRead = useCallback(async () => {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    })
    mutate()
  }, [mutate])

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      })
      mutate()
    },
    [mutate],
  )

  const notifications = data?.notifications || []

  return {
    notifications,
    unreadCount: notifications.filter((n: { read: boolean }) => !n.read).length,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    mutate,
  }
}
