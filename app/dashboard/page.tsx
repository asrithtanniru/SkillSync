"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Video, Coins, Star, MessageCircle, TrendingUp, Award, Clock, Send, Inbox, Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { toast } from "sonner"
import { MatchesSection } from "@/components/matches-section"
import { ConnectionsSection } from "@/components/connections-section"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalTokens: 0,
    skillsLearned: 0,
    skillsTaught: 0,
    activeConnections: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/user/stats")
      if (!response.ok) throw new Error("Failed to fetch stats")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Failed to load stats", {
        description: "Please try refreshing the page"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0E9D2]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#181D31] mb-6">Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-[#E6DDC4]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="matches" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Matches
            </TabsTrigger>
            <TabsTrigger value="my-requests" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              My Requests
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#181D31]">Total Tokens</CardTitle>
                  <Coins className="h-4 w-4 text-[#678983]" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-[#181D31]">{stats.totalTokens}</div>
                      <p className="text-xs text-[#181D31]/70">+20% from last month</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#181D31]">Skills Learned</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#678983]" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-[#181D31]">{stats.skillsLearned}</div>
                      <p className="text-xs text-[#181D31]/70">+2 this month</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#181D31]">Skills Taught</CardTitle>
                  <Award className="h-4 w-4 text-[#678983]" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-[#181D31]">{stats.skillsTaught}</div>
                      <p className="text-xs text-[#181D31]/70">+3 this month</p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#181D31]">Active Connections</CardTitle>
                  <Users className="h-4 w-4 text-[#678983]" />
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-[#181D31]">{stats.activeConnections}</div>
                      <p className="text-xs text-[#181D31]/70">2 new this week</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">Recent Matches</CardTitle>
                  <CardDescription>New skill exchange opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <MatchesSection />
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">Recent Connections</CardTitle>
                  <CardDescription>Your latest connections</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConnectionsSection />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">Skill Matches</CardTitle>
                <CardDescription>People who want to learn what you teach and vice versa</CardDescription>
              </CardHeader>
              <CardContent>
                <MatchesSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">My Connection Requests</CardTitle>
                <CardDescription>Requests you've sent to others</CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectionsSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">Learning Sessions</CardTitle>
                <CardDescription>Manage your upcoming and past sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium">Coming Soon</h3>
                  <p className="text-muted-foreground">Session management will be available soon!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">Learning Progress</CardTitle>
                  <CardDescription>Skills you're currently learning</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-muted-foreground">Progress tracking will be available soon!</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">Teaching Impact</CardTitle>
                  <CardDescription>Your contribution to the community</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium">Coming Soon</h3>
                    <p className="text-muted-foreground">Teaching impact tracking will be available soon!</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
