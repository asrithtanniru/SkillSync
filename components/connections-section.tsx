"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, MessageCircle, Video } from "lucide-react"
import { ChatWindow } from "@/components/chat-window"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import dynamic from 'next/dynamic';

const VideoCall = dynamic(() => import('@/components/video-call').then(mod => mod.VideoCall), {
  ssr: false,
});

interface Connection {
  id: string
  status: string
  message: string | null
  createdAt: string
  fromUser: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  toUser: {
    id: string
    name: string | null
    email: string | null
    image: string | null
  }
  event: {
    id: string
    title: string | null
    skill: {
      name: string
    }
  } | null
  currentUserId: string
  chatRoom?: {
    id: string
  }
}

export function ConnectionsSection() {
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/connections")
      if (!response.ok) throw new Error("Failed to fetch connections")
      const data = await response.json()
      setConnections(data)
    } catch (error) {
      console.error("Error fetching connections:", error)
      toast({
        title: "Error",
        description: "Failed to load connections. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (connectionId: string, status: string) => {
    try {
      const response = await fetch("/api/connections", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          connectionId,
          status
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data || "Failed to update connection status")
      }

      // If the connection was accepted, make sure it has a chat room
      if (status === "accepted" && !data.chatRoom) {
        // Create a chat room for this connection
        const chatRoomResponse = await fetch("/api/chat-rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            connectionId
          })
        })

        if (!chatRoomResponse.ok) {
          throw new Error("Failed to create chat room")
        }

        const chatRoomData = await chatRoomResponse.json()
        data.chatRoom = chatRoomData
      }

      toast({
        title: "Success",
        description: `Connection ${status} successfully!`
      })

      // Update the connection in the list
      setConnections(prev => prev.map(conn =>
        conn.id === connectionId ? data : conn
      ))
    } catch (error) {
      console.error("Error updating connection status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update connection status. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleChat = (connection: Connection) => {
    setSelectedConnection(connection)
    setIsChatWindowOpen(true)
  }

  const handleVideoCall = (connection: Connection) => {
    setSelectedConnection(connection)
    setIsVideoCallOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No connections yet</h3>
        <p className="text-muted-foreground">Start connecting with other users to see them here!</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {connections.map((connection) => {
          const otherUser = connection.fromUser.id === connection.currentUserId
            ? connection.toUser
            : connection.fromUser

          const currentUser = connection.fromUser.id === connection.currentUserId
            ? connection.fromUser
            : connection.toUser

          return (
            <Card key={connection.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="min-w-0 shrink-0">
                    <AvatarImage src={otherUser.image || undefined} />
                    <AvatarFallback>{otherUser.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-semibold truncate">
                      {otherUser.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground truncate">
                      {otherUser.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <div>
                    <Badge variant={connection.status === "accepted" ? "default" : "secondary"}>
                      {connection.status}
                    </Badge>
                  </div>
                  {connection.message && (
                    <p className="text-sm text-muted-foreground">{connection.message}</p>
                  )}
                  {connection.event && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Event:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          {connection.event.title || "Untitled Event"}
                        </Badge>
                        <Badge variant="outline">
                          {connection.event.skill.name}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                {connection.status === "pending" && connection.toUser.id === connection.currentUserId && (
                  <>
                    <Button
                      onClick={() => handleStatusUpdate(connection.id, "accepted")}
                      className="flex-1"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(connection.id, "rejected")}
                      variant="outline"
                      className="flex-1"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {connection.status === "accepted" && (
                  <>
                    <Button
                      onClick={() => handleChat(connection)}
                      className="flex-1"
                      variant="secondary"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button
                      onClick={() => handleVideoCall(connection)}
                      className="flex-1"
                      variant="secondary"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Video Call
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <Dialog open={isChatWindowOpen} onOpenChange={(open) => {
        setIsChatWindowOpen(open);
        if (!open) setSelectedConnection(null);
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Chat with {selectedConnection?.fromUser.id === selectedConnection?.currentUserId ? selectedConnection?.toUser.name : selectedConnection?.fromUser.name}</DialogTitle>
          </DialogHeader>
          {selectedConnection && (
            <ChatWindow
              connectionId={selectedConnection.id}
              otherUser={selectedConnection.fromUser.id === selectedConnection.currentUserId ? selectedConnection.toUser : selectedConnection.fromUser}
              currentUser={{
                id: selectedConnection.currentUserId,
                name: selectedConnection.fromUser.id === selectedConnection.currentUserId ? selectedConnection.fromUser.name : selectedConnection.toUser.name
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {isVideoCallOpen && selectedConnection && (
        <VideoCall
          isOpen={isVideoCallOpen}
          onClose={() => {
            setIsVideoCallOpen(false)
            setSelectedConnection(null)
          }}
          roomId={selectedConnection.id}
          userId={selectedConnection.currentUserId}
          userName={selectedConnection.fromUser.id === selectedConnection.currentUserId ? selectedConnection.fromUser.name || "User" : selectedConnection.toUser.name || "User"}
        />
      )}
    </>
  )
}
