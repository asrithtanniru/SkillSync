"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface Match {
  id: string
  name: string | null
  email: string | null
  image: string | null
  location: string | null
  timezone: string | null
  teachingSkills: {
    id: string
    name: string
  }[]
  learningSkills: {
    id: string
    name: string
  }[]
  matchScore: number
  matchingSkills: {
    teaching: number
    learning: number
  }
}

export function MatchesSection() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/matches")
      if (!response.ok) throw new Error("Failed to fetch matches")
      const data = await response.json()
      setMatches(data)
    } catch (error) {
      console.error("Error fetching matches:", error)
      toast({
        title: "Error",
        description: "Failed to load matches. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (matchId: string) => {
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toUserId: matchId,
          message: "I'd like to connect with you based on our matching skills!"
        })
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast({
        title: "Success",
        description: "Connection request sent successfully!"
      })

      // Refresh matches to update UI
      fetchMatches()
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: "Failed to send connection request. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No new matches found</h3>
        <p className="text-muted-foreground">
          You might already be connected with potential matches, or you need to update your skills to find new matches.
          <br />
          Try adding more skills to your profile to increase your chances of finding matches!
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <Card key={match.id} className="flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={match.image || undefined} />
                <AvatarFallback>{match.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{match.name}</CardTitle>
                <CardDescription>{match.email}</CardDescription>
              </div>
            </div>
            <div className="mt-2">
              <Badge className="bg-[#678983] text-white">
                Match Score: {match.matchScore}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-4">
              {match.location && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Location:</h4>
                  <p className="text-sm text-muted-foreground">{match.location}</p>
                </div>
              )}
              {match.timezone && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Timezone:</h4>
                  <p className="text-sm text-muted-foreground">{match.timezone}</p>
                </div>
              )}
              {match.matchingSkills.teaching > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Can Teach You:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.teachingSkills
                      .filter(skill => match.learningSkills.some(ls => ls.id === skill.id))
                      .map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="bg-green-100 text-green-700">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              {match.matchingSkills.learning > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Wants to Learn From You:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.learningSkills
                      .filter(skill => match.teachingSkills.some(ts => ts.id === skill.id))
                      .map((skill) => (
                        <Badge key={skill.id} variant="outline" className="border-blue-200 text-blue-700">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              {match.teachingSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Other Skills They Can Teach:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.teachingSkills
                      .filter(skill => !match.learningSkills.some(ls => ls.id === skill.id))
                      .map((skill) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
              {match.learningSkills.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Other Skills They Want to Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {match.learningSkills
                      .filter(skill => !match.teachingSkills.some(ts => ts.id === skill.id))
                      .map((skill) => (
                        <Badge key={skill.id} variant="outline">
                          {skill.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handleConnect(match.id)}
              className="w-full bg-[#678983] hover:bg-[#678983]/90 text-white"
            >
              Connect
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
} 
