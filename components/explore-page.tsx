"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { CreateEvent } from "./create-event"

interface Event {
  id: string
  title: string | null
  description: string | null
  type: string
  level: string
  date: string
  time: string | null
  duration: string | null
  location: string | null
  user: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  skill: {
    id: string
    name: string
  }
}

export function ExplorePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (!response.ok) throw new Error("Failed to fetch events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to load events. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = async (eventId: string, toUserId: string) => {
    setConnecting(eventId)
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          toUserId,
          eventId,
          message: "I'd like to connect with you about this event!"
        })
      })

      const data = await response.text()

      if (!response.ok) {
        throw new Error(data || "Failed to send connection request")
      }

      // Remove the event from the list since a connection was created
      setEvents(prev => prev.filter(event => event.id !== eventId))

      toast({
        title: "Success",
        description: "Connection request sent successfully!"
      })
    } catch (error) {
      console.error("Error sending connection request:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send connection request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setConnecting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CreateEvent onEventCreated={fetchEvents} />
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground">Create an event to get started!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={event.user.image || undefined} />
                    <AvatarFallback>{event.user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{event.title || "Untitled Event"}</CardTitle>
                    <CardDescription>by {event.user.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{event.type}</Badge>
                    <Badge variant="secondary">{event.level}</Badge>
                    <Badge variant="outline">{event.skill.name}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    {event.time && (
                      <p className="text-sm">
                        <span className="font-medium">Time:</span> {event.time}
                      </p>
                    )}
                    {event.duration && (
                      <p className="text-sm">
                        <span className="font-medium">Duration:</span> {event.duration} minutes
                      </p>
                    )}
                    {event.location && (
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleConnect(event.id, event.user.id)}
                  className="w-full"
                  disabled={connecting === event.id}
                >
                  {connecting === event.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
