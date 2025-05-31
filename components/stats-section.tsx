"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Stats {
  totalConnections: number
  totalSessions: number
  totalHours: number
  averageRating: number
}

export function StatsSection() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "Failed to load stats. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No stats available</h3>
        <p className="text-muted-foreground">Complete some sessions to see your stats!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Connections</CardTitle>
          <CardDescription>Your network size</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalConnections}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Sessions</CardTitle>
          <CardDescription>Completed sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalSessions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Hours</CardTitle>
          <CardDescription>Time spent learning</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalHours}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
          <CardDescription>From your sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
        </CardContent>
      </Card>
    </div>
  )
} 
