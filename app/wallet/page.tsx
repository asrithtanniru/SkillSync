"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import {
  Coins,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  ExternalLink,
  Copy,
  RefreshCw,
  Award,
  Users,
} from "lucide-react"
import RewardSystem from '@/components/reward-system'

export default function WalletPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress] = useState("0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C")

  const walletStats = {
    totalTokens: 1250,
    totalEarned: 2100,
    totalSpent: 850,
    pendingRewards: 75,
    rank: 42,
    totalUsers: 15000,
  }

  const transactions = [
    {
      id: 1,
      type: "earned",
      amount: 50,
      description: "Completed React Development session with Sarah Chen",
      date: "2024-01-15",
      status: "completed",
      txHash: "0x1234...5678",
    },
    {
      id: 2,
      type: "earned",
      amount: 25,
      description: "Session completion bonus",
      date: "2024-01-15",
      status: "completed",
      txHash: "0x2345...6789",
    },
    {
      id: 3,
      type: "spent",
      amount: -30,
      description: "Spanish Language session with Miguel Rodriguez",
      date: "2024-01-14",
      status: "completed",
      txHash: "0x3456...7890",
    },
    {
      id: 4,
      type: "earned",
      amount: 40,
      description: "Completed Python Programming session with Alex Kim",
      date: "2024-01-13",
      status: "completed",
      txHash: "0x4567...8901",
    },
    {
      id: 5,
      type: "pending",
      amount: 35,
      description: "UI/UX Design session with Emma Wilson",
      date: "2024-01-12",
      status: "pending",
      txHash: "0x5678...9012",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Alex Chen", tokens: 5420, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 2, name: "Maria Garcia", tokens: 4890, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 3, name: "David Kim", tokens: 4650, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 4, name: "Sarah Johnson", tokens: 4200, avatar: "/placeholder.svg?height=32&width=32" },
    { rank: 5, name: "Mike Wilson", tokens: 3980, avatar: "/placeholder.svg?height=32&width=32" },
  ]

  const connectWallet = () => {
    setIsConnected(true)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
  }

  // Add a sample session data for testing
  const sampleSession = {
    id: "session123",
    teacherAddress: "0x742d35Cc6634C0532925a3b8D4C9db4C4C4C4C4C",
    learnerAddress: "0x1234567890123456789012345678901234567890",
    duration: 120, // 2 hours in minutes
    subject: "React Development"
  };

  return (
    <div className="min-h-screen bg-[#F0E9D2]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Wallet Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#678983] to-[#678983]/80 text-white border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{walletStats.totalTokens}</div>
              <div className="text-sm opacity-90">SST Tokens</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E6DDC4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#181D31] flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-[#678983]" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#181D31] mb-1">{walletStats.totalEarned}</div>
              <div className="text-sm text-[#181D31]/70">All time</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E6DDC4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#181D31] flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#678983]" />
                Leaderboard Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#181D31] mb-1">#{walletStats.rank}</div>
              <div className="text-sm text-[#181D31]/70">of {walletStats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white border-[#E6DDC4]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-[#181D31] flex items-center">
                <RefreshCw className="w-5 h-5 mr-2 text-[#678983]" />
                Pending Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#181D31] mb-1">{walletStats.pendingRewards}</div>
              <div className="text-sm text-[#181D31]/70">Processing</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-[#E6DDC4]">
            <TabsTrigger
              value="transactions"
              className="data-[state=active]:bg-[#678983] data-[state=active]:text-white"
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-[#678983] data-[state=active]:text-white"
            >
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="rewards" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Earn Rewards
            </TabsTrigger>
            <TabsTrigger value="session-reviews" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
              Session Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#181D31]">Transaction History</CardTitle>
                    <CardDescription>Your recent token transactions</CardDescription>
                  </div>
                  {isConnected && (
                    <div className="flex items-center space-x-2 text-sm text-[#181D31]/70">
                      <span>Wallet:</span>
                      <code className="bg-[#F0E9D2] px-2 py-1 rounded text-xs">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </code>
                      <Button variant="ghost" size="sm" onClick={copyAddress}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 border border-[#E6DDC4] rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === "earned" ? "bg-green-100" : tx.type === "spent" ? "bg-red-100" : "bg-yellow-100"
                            }`}
                        >
                          {tx.type === "earned" ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : tx.type === "spent" ? (
                            <ArrowUpRight className="w-5 h-5 text-red-600" />
                          ) : (
                            <RefreshCw className="w-5 h-5 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#181D31]">{tx.description}</p>
                          <div className="flex items-center space-x-2 text-sm text-[#181D31]/70">
                            <span>{tx.date}</span>
                            <Badge
                              variant={tx.status === "completed" ? "default" : "secondary"}
                              className={
                                tx.status === "completed" ? "bg-[#678983] text-white" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-semibold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                          {tx.amount > 0 ? "+" : ""}
                          {tx.amount} SST
                        </div>
                        <button className="text-xs text-[#181D31]/50 hover:text-[#678983] flex items-center">
                          View on Explorer
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">Top Contributors</CardTitle>
                <CardDescription>Users with the most tokens earned through teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center justify-between p-4 border border-[#E6DDC4] rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${user.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : user.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : user.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-[#F0E9D2] text-[#181D31]"
                            }`}
                        >
                          #{user.rank}
                        </div>
                        <div className="w-10 h-10 bg-[#678983]/10 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#678983]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#181D31]">{user.name}</p>
                          <p className="text-sm text-[#181D31]/70">Community Contributor</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#678983]">{user.tokens.toLocaleString()}</div>
                        <div className="text-sm text-[#181D31]/70">SST Tokens</div>
                      </div>
                    </div>
                  ))}

                  {/* Current User Position */}
                  <div className="border-t border-[#E6DDC4] pt-4">
                    <div className="flex items-center justify-between p-4 bg-[#678983]/5 border-2 border-[#678983]/20 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-[#678983] text-white flex items-center justify-center font-bold text-sm">
                          #{walletStats.rank}
                        </div>
                        <div className="w-10 h-10 bg-[#678983]/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#678983]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#181D31]">You</p>
                          <p className="text-sm text-[#181D31]/70">Your current position</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#678983]">
                          {walletStats.totalTokens.toLocaleString()}
                        </div>
                        <div className="text-sm text-[#181D31]/70">SST Tokens</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">How to Earn Tokens</CardTitle>
                  <CardDescription>Different ways to earn SST tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-[#F0E9D2] rounded-lg">
                    <div>
                      <p className="font-medium text-[#181D31]">Complete Teaching Session</p>
                      <p className="text-sm text-[#181D31]/70">Teach a skill to another user</p>
                    </div>
                    <Badge className="bg-[#678983] text-white">+50 SST</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F0E9D2] rounded-lg">
                    <div>
                      <p className="font-medium text-[#181D31]">Receive 5-Star Review</p>
                      <p className="text-sm text-[#181D31]/70">Get excellent feedback</p>
                    </div>
                    <Badge className="bg-[#678983] text-white">+25 SST</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F0E9D2] rounded-lg">
                    <div>
                      <p className="font-medium text-[#181D31]">Refer New User</p>
                      <p className="text-sm text-[#181D31]/70">Invite friends to join</p>
                    </div>
                    <Badge className="bg-[#678983] text-white">+100 SST</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-[#F0E9D2] rounded-lg">
                    <div>
                      <p className="font-medium text-[#181D31]">Weekly Teaching Streak</p>
                      <p className="text-sm text-[#181D31]/70">Teach 5+ sessions per week</p>
                    </div>
                    <Badge className="bg-[#678983] text-white">+200 SST</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#E6DDC4]">
                <CardHeader>
                  <CardTitle className="text-[#181D31]">Token Utility</CardTitle>
                  <CardDescription>What you can do with your SST tokens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-[#F0E9D2] rounded-lg">
                    <p className="font-medium text-[#181D31] mb-1">Book Premium Sessions</p>
                    <p className="text-sm text-[#181D31]/70">
                      Access exclusive 1-on-1 sessions with top-rated teachers
                    </p>
                  </div>

                  <div className="p-3 bg-[#F0E9D2] rounded-lg">
                    <p className="font-medium text-[#181D31] mb-1">Unlock Advanced Features</p>
                    <p className="text-sm text-[#181D31]/70">Priority matching, extended session time, and more</p>
                  </div>

                  <div className="p-3 bg-[#F0E9D2] rounded-lg">
                    <p className="font-medium text-[#181D31] mb-1">Trade on DEX</p>
                    <p className="text-sm text-[#181D31]/70">Exchange SST tokens on decentralized exchanges</p>
                  </div>

                  <div className="p-3 bg-[#F0E9D2] rounded-lg">
                    <p className="font-medium text-[#181D31] mb-1">Governance Voting</p>
                    <p className="text-sm text-[#181D31]/70">Vote on platform improvements and new features</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="session-reviews" className="space-y-6">
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">Session Reviews</CardTitle>
                <CardDescription>Review your completed sessions and earn rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <RewardSystem sessionData={sampleSession} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
