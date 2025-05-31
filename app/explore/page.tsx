"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Star, MapPin, Clock, Video, MessageCircle, Heart, Plus } from "lucide-react"
import { EventCard } from "@/components/event-card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { CreateEvent } from "../components/create-event"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

interface Event {
  id: string
  type: "learn" | "teach"
  skill: {
    name: string
  }
  description: string
  date: Date
  time: string
  duration: string
  level: string
  isRelevant: boolean
  user: {
    name: string
    image?: string
    location: string
    id: string
  }
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "learn" | "teach">("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [events, setEvents] = useState<Event[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const [connectionStatus, setConnectionStatus] = useState<{ [eventId: string]: "idle" | "pending" | "success" | "error" }>({})
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [connectionMessage, setConnectionMessage] = useState("")
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)

  // Reset connection status when modal closes
  useEffect(() => {
    if (!isMessageDialogOpen) {
      setSelectedEventId(null)
      setConnectionMessage("")
    }
  }, [isMessageDialogOpen])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams({
          type: selectedType,
          level: selectedLevel,
          search: debouncedSearch,
        })

        const response = await fetch(`/api/events?${params}`)
        if (!response.ok) {
          throw new Error("Failed to fetch events")
        }

        const data = await response.json()
        // Transform the data to match the Event interface
        const transformedEvents = data.map((event: any) => ({
          id: event.id,
          type: event.type,
          skill: {
            name: event.skill.name
          },
          description: event.description,
          date: new Date(event.date),
          time: event.time,
          duration: event.duration,
          level: event.level,
          isRelevant: event.isRelevant || false,
          user: {
            name: event.user.name || "Unknown User",
            image: event.user.image,
            location: event.user.location || "Unknown Location",
            id: event.user.id
          }
        }))
        setEvents(transformedEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
        toast.error("Failed to load events", {
          description: "Please try refreshing the page"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [selectedType, selectedLevel, debouncedSearch])

  const handleCreateEvent = async (newEvent: Omit<Event, "id" | "user" | "skill"> & { skill: string }) => {
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newEvent,
          date: newEvent.date?.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to create event")
      }

      const createdEvent = await response.json()

      // Add the new event to the list
      setEvents([
        {
          id: createdEvent.id,
          type: createdEvent.type,
          skill: { name: createdEvent.skill.name },
          description: createdEvent.description,
          date: new Date(createdEvent.date),
          time: createdEvent.time,
          duration: createdEvent.duration,
          level: createdEvent.level,
          isRelevant: createdEvent.isRelevant,
          user: {
            name: createdEvent.user.name || "Current User",
            image: createdEvent.user.image || "/placeholder.svg",
            location: createdEvent.user.location || "Your Location",
            id: createdEvent.user.id,
          },
        },
        ...events,
      ])

      // Close the modal after successful creation
      setIsCreateModalOpen(false)
    } catch (error) {
      console.error("Error creating event:", error)
      alert(error instanceof Error ? error.message : "Failed to create event")
    }
  }

  const handleConnect = async (eventId: string) => {
    // Check if there's already a pending request
    if (connectionStatus[eventId] === "pending") {
      toast.error("Request already in progress", {
        description: "Please wait for the current request to complete"
      })
      return
    }

    // Check if there's already a successful request
    if (connectionStatus[eventId] === "success") {
      toast.info("Request already sent", {
        description: "You've already sent a connection request for this event",
        action: {
          label: "View Requests",
          onClick: () => window.location.href = '/dashboard?tab=my-requests'
        }
      })
      return
    }

    setSelectedEventId(eventId)
    setConnectionMessage("")
    setIsMessageDialogOpen(true)
  }

  const handleSendRequest = async () => {
    if (!selectedEventId) return

    setConnectionStatus((prev) => ({ ...prev, [selectedEventId]: "pending" }))
    try {
      // Find the event to get the user ID
      const event = events.find(e => e.id === selectedEventId)
      if (!event) {
        throw new Error("Event not found")
      }

      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEventId,
          toUserId: event.user.id,
          message: connectionMessage.trim() || undefined
        }),
      })

      const contentType = res.headers.get("content-type")
      let errorMessage = "Failed to send request"

      if (res.ok) {
        setConnectionStatus((prev) => ({ ...prev, [selectedEventId]: "success" }))
        toast.success("Connection request sent!", {
          description: "The user will be notified of your request",
          action: {
            label: "View Requests",
            onClick: () => window.location.href = '/dashboard?tab=my-requests'
          }
        })
        setIsMessageDialogOpen(false)
      } else {
        if (contentType?.includes("application/json")) {
          const data = await res.json()
          errorMessage = data.message || data.error || data
        } else {
          errorMessage = await res.text()
        }
        console.error("Server error:", errorMessage)
        setConnectionStatus((prev) => ({ ...prev, [selectedEventId]: "error" }))
        toast.error("Failed to send request", {
          description: errorMessage
        })
      }
    } catch (e) {
      console.error("Request error:", e)
      setConnectionStatus((prev) => ({ ...prev, [selectedEventId]: "error" }))
      toast.error("Failed to send request", {
        description: "Please check your internet connection and try again"
      })
    }
  }

  const handleMessage = (eventId: string) => {
    // In a real app, this would open a chat with the user
    console.log("Messaging event:", eventId)
  }

  return (
    <div className="min-h-screen bg-[#F0E9D2]">
      {/* Header */}
      <header className="border-b border-[#E6DDC4] bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-[#181D31]">Explore Skills</h1>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#678983] hover:bg-[#678983]/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogTitle>Create New Event</DialogTitle>
                <CreateEvent onSubmit={handleCreateEvent} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#181D31]/50 w-5 h-5" />
              <Input
                placeholder="Search skills, events, or people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#E6DDC4] focus:border-[#678983]"
              />
            </div>

            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={(value: "all" | "learn" | "teach") => setSelectedType(value)}>
                <SelectTrigger className="w-48 bg-white border-[#E6DDC4]">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="learn">Want to Learn</SelectItem>
                  <SelectItem value="teach">Want to Teach</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-48 bg-white border-[#E6DDC4]">
                  <SelectValue placeholder="Experience Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-[#181D31]/70">
            {isLoading ? "Loading events..." : `Found ${events.length} events`}
          </p>
          <Select defaultValue="relevance">
            <SelectTrigger className="w-48 bg-white border-[#E6DDC4]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Most Relevant</SelectItem>
              <SelectItem value="date">Soonest</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={{
                id: event.id,
                type: event.type,
                skill: event.skill,
                description: event.description,
                date: new Date(event.date),
                time: event.time,
                duration: event.duration,
                level: event.level,
                isRelevant: event.isRelevant,
                user: {
                  name: event.user.name,
                  image: event.user.image,
                  location: event.user.location,
                  id: event.user.id
                },
              }}
              onConnect={handleConnect}
              onMessage={handleMessage}
              connectionStatus={connectionStatus[event.id]}
              isCurrentUser={event.user.id === "current-user-id"}
            />
          ))}
        </div>
      </div>

      {/* Add Message Dialog */}
      <Dialog
        open={isMessageDialogOpen}
        onOpenChange={(open) => {
          if (!open && connectionStatus[selectedEventId || ""] === "pending") {
            toast.error("Cannot close while sending request", {
              description: "Please wait for the request to complete"
            })
            return
          }
          setIsMessageDialogOpen(open)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Connection Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Add a message to your request (optional)"
              value={connectionMessage}
              onChange={(e) => setConnectionMessage(e.target.value)}
              className="min-h-[100px]"
              disabled={connectionStatus[selectedEventId || ""] === "pending"}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsMessageDialogOpen(false)}
              disabled={connectionStatus[selectedEventId || ""] === "pending"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendRequest}
              disabled={connectionStatus[selectedEventId || ""] === "pending"}
              className="bg-[#678983] hover:bg-[#678983]/90 text-white"
            >
              {connectionStatus[selectedEventId || ""] === "pending" ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
