"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/header"
import { Edit3, MapPin, Clock, Star, Award, Users, Calendar, Plus, X, Save, Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [teachingSkills, setTeachingSkills] = useState<string[]>([])
  const [learningSkills, setLearningSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (!response.ok) throw new Error("Failed to fetch profile")
      const data = await response.json()

      setUserData(data)
      setTeachingSkills(data.teachingSkills.map((skill: { name: string }) => skill.name))
      setLearningSkills(data.learningSkills.map((skill: { name: string }) => skill.name))
      setLoading(false)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast.error("Failed to load profile")
      setLoading(false)
    }
  }

  // Random data for ratings and stats
  const randomStats = {
    rating: (Math.random() * 2 + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 100) + 20,
    totalSessions: Math.floor(Math.random() * 100) + 10,
    tokensEarned: Math.floor(Math.random() * 2000) + 500,
    studentsTaught: Math.floor(Math.random() * 50) + 10,
    skillsMastered: Math.floor(Math.random() * 10) + 5,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0E9D2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#678983]" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F0E9D2] flex items-center justify-center">
        <p className="text-[#181D31]">Failed to load profile</p>
      </div>
    )
  }

  const userProfile = {
    name: userData.name || "User",
    email: userData.email,
    avatar: userData.image || "/placeholder.svg?height=120&width=120",
    location: userData.location || "Not specified",
    timezone: userData.timezone || "Not specified",
    bio: userData.bio || "No bio provided",
    joinDate: new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    rating: randomStats.rating,
    reviewCount: randomStats.reviewCount,
    totalSessions: randomStats.totalSessions,
    tokensEarned: randomStats.tokensEarned,
    availability: userData.availability || "Not specified",
  }

  const reviews = [
    {
      id: 1,
      reviewer: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Alex is an amazing teacher! He explained React concepts so clearly and patiently answered all my questions. Highly recommend!",
      skill: "React Development",
      date: "2 weeks ago",
    },
    {
      id: 2,
      reviewer: "Miguel Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      comment:
        "Great session on TypeScript. Alex provided practical examples and helped me understand advanced concepts. Will definitely book again!",
      skill: "TypeScript",
      date: "1 month ago",
    },
    {
      id: 3,
      reviewer: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      comment:
        "Very knowledgeable and patient instructor. The Node.js session was exactly what I needed to level up my backend skills.",
      skill: "Node.js",
      date: "1 month ago",
    },
  ]

  const addSkill = (type: "teaching" | "learning") => {
    if (newSkill.trim()) {
      if (type === "teaching") {
        setTeachingSkills([...teachingSkills, newSkill.trim()])
      } else {
        setLearningSkills([...learningSkills, newSkill.trim()])
      }
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string, type: "teaching" | "learning") => {
    if (type === "teaching") {
      setTeachingSkills(teachingSkills.filter((s) => s !== skill))
    } else {
      setLearningSkills(learningSkills.filter((s) => s !== skill))
    }
  }

  const saveSkills = async () => {
    try {
      const response = await fetch("/api/user/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          teachingSkills,
          learningSkills
        })
      })

      if (!response.ok) throw new Error("Failed to save skills")

      toast.success("Skills updated successfully")
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving skills:", error)
      toast.error("Failed to save skills")
    }
  }

  return (
    <div className="min-h-screen bg-[#F0E9D2]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-white border-[#E6DDC4]">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-32 h-32 mx-auto">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-[#678983] hover:bg-[#678983]/90"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <Input defaultValue={userProfile.name} className="text-center font-semibold" />
                    <Input defaultValue={userProfile.location} className="text-center text-sm" />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#181D31] mb-2">{userProfile.name}</h2>
                    <div className="flex items-center justify-center space-x-1 text-[#181D31]/70 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{userProfile.location}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-center space-x-1 mb-4">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-[#181D31]">{userProfile.rating}</span>
                  <span className="text-[#181D31]/70">({userProfile.reviewCount} reviews)</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#678983]">{randomStats.totalSessions}</div>
                    <div className="text-sm text-[#181D31]/70">Sessions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#678983]">{randomStats.tokensEarned}</div>
                    <div className="text-sm text-[#181D31]/70">SST Earned</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white border-[#E6DDC4]">
              <CardHeader>
                <CardTitle className="text-[#181D31]">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[#678983]" />
                    <span className="text-[#181D31]">Students Taught</span>
                  </div>
                  <span className="font-semibold text-[#181D31]">{randomStats.studentsTaught}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-[#678983]" />
                    <span className="text-[#181D31]">Skills Mastered</span>
                  </div>
                  <span className="font-semibold text-[#181D31]">{randomStats.skillsMastered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#678983]" />
                    <span className="text-[#181D31]">Member Since</span>
                  </div>
                  <span className="font-semibold text-[#181D31]">{userProfile.joinDate}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white border border-[#E6DDC4]">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-[#678983] data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-[#678983] data-[state=active]:text-white">
                  Skills
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-[#678983] data-[state=active]:text-white"
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-[#678983] data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-[#181D31]">About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        defaultValue={userProfile.bio}
                        className="min-h-32"
                        placeholder="Tell others about yourself, your experience, and what you're passionate about..."
                      />
                    ) : (
                      <p className="text-[#181D31]/80 leading-relaxed">{userProfile.bio}</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-[#181D31]">Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-[#678983]" />
                        <span className="text-[#181D31]">Timezone: {userProfile.timezone}</span>
                      </div>
                      {isEditing ? (
                        <Textarea
                          defaultValue={userProfile.availability}
                          placeholder="When are you typically available for sessions?"
                        />
                      ) : (
                        <p className="text-[#181D31]/80">{userProfile.availability}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-[#181D31]">Skills I Can Teach</CardTitle>
                      <CardDescription>Share your expertise with others</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (isEditing) {
                          saveSkills()
                        } else {
                          setIsEditing(true)
                        }
                      }}
                      className="border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white"
                    >
                      {isEditing ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                      {isEditing ? "Save Changes" : "Edit Skills"}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-[#678983]" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {teachingSkills.map((skill) => (
                            <Badge
                              key={skill}
                              className="bg-[#678983]/10 text-[#678983] hover:bg-[#678983] hover:text-white relative group"
                            >
                              {skill}
                              {isEditing && (
                                <button
                                  onClick={() => removeSkill(skill, "teaching")}
                                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>

                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill you can teach..."
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addSkill("teaching")}
                            />
                            <Button
                              onClick={() => addSkill("teaching")}
                              size="sm"
                              className="bg-[#678983] hover:bg-[#678983]/90 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-[#181D31]">Skills I Want to Learn</CardTitle>
                    <CardDescription>What would you like to improve or learn?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-8 w-8 animate-spin text-[#678983]" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {learningSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="border-[#E6DDC4] text-[#181D31]/70 relative group"
                            >
                              {skill}
                              {isEditing && (
                                <button
                                  onClick={() => removeSkill(skill, "learning")}
                                  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>

                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add a skill you want to learn..."
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && addSkill("learning")}
                            />
                            <Button
                              onClick={() => addSkill("learning")}
                              size="sm"
                              className="bg-[#678983] hover:bg-[#678983]/90 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-[#181D31]">Student Reviews</CardTitle>
                    <CardDescription>What others say about learning with you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-[#E6DDC4] last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {review.reviewer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-[#181D31]">{review.reviewer}</h4>
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                      />
                                    ))}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {review.skill}
                                  </Badge>
                                </div>
                              </div>
                              <span className="text-sm text-[#181D31]/50">{review.date}</span>
                            </div>
                            <p className="text-[#181D31]/80">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-[#181D31]">Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-[#181D31]">
                          Email Address
                        </Label>
                        <Input id="email" type="email" defaultValue={userProfile.email} className="mt-1" />
                      </div>

                      <div>
                        <Label htmlFor="timezone" className="text-[#181D31]">
                          Timezone
                        </Label>
                        <Input id="timezone" defaultValue={userProfile.timezone} className="mt-1" />
                      </div>

                      <div>
                        <Label className="text-[#181D31]">Notification Preferences</Label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded border-[#E6DDC4]" />
                            <span className="text-sm text-[#181D31]">Email notifications for new matches</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded border-[#E6DDC4]" />
                            <span className="text-sm text-[#181D31]">Session reminders</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded border-[#E6DDC4]" />
                            <span className="text-sm text-[#181D31]">Marketing emails</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E6DDC4]">
                      <Button className="bg-[#678983] hover:bg-[#678983]/90 text-white">Save Settings</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-[#E6DDC4]">
                  <CardHeader>
                    <CardTitle className="text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
