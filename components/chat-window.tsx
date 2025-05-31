"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"

interface ChatWindowProps {
  connectionId: string
  otherUser: {
    id: string
    name: string | null
    image: string | null
  }
  currentUser: {
    id: string
    name: string | null
  }
}

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    image: string | null
  }
}

export function ChatWindow({ connectionId, otherUser, currentUser }: ChatWindowProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [chatRoomId, setChatRoomId] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const { toast } = useToast()
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // First, get the chat room ID for this connection
  useEffect(() => {
    const getChatRoom = async () => {
      try {
        const res = await fetch(`/api/connections/${connectionId}`)
        if (!res.ok) throw new Error("Failed to fetch connection")
        const data = await res.json()
        setConnectionStatus(data.status)

        if (data.status !== "accepted") {
          throw new Error("Connection not accepted")
        }

        if (!data.chatRoom?.id) {
          // If no chat room exists, try to create one
          const chatRoomRes = await fetch("/api/chat-rooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              connectionId
            })
          })

          if (!chatRoomRes.ok) {
            throw new Error("Failed to create chat room")
          }

          const chatRoomData = await chatRoomRes.json()
          setChatRoomId(chatRoomData.id)
        } else {
          setChatRoomId(data.chatRoom.id)
        }
      } catch (error) {
        console.error("Error fetching chat room:", error)
        toast({
          title: "Error",
          description: error instanceof Error && error.message === "Connection not accepted"
            ? "This connection has not been accepted yet"
            : "Failed to load chat. Please try again.",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    getChatRoom()
  }, [connectionId])

  // Then, fetch messages once we have the chat room ID
  useEffect(() => {
    if (!chatRoomId) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages?chatRoomId=${chatRoomId}`)
        if (!res.ok) throw new Error("Failed to fetch messages")
        const data = await res.json()
        setMessages(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages. Please try again.",
          variant: "destructive"
        })
        setIsLoading(false)
      }
    }

    fetchMessages()

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000)

    return () => clearInterval(interval)
  }, [chatRoomId])

  const handleSendMessage = async () => {
    if (!message.trim() || !chatRoomId) return

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chatRoomId,
          content: message.trim()
        })
      })

      if (!res.ok) throw new Error("Failed to send message")

      const newMessage = await res.json()
      setMessages(prev => [...prev, newMessage])
      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#678983]" />
        </CardContent>
      </Card>
    )
  }

  if (connectionStatus !== "accepted") {
    return (
      <Card className="w-full h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chat is only available after the connection is accepted</p>
        </CardContent>
      </Card>
    )
  }

  if (!chatRoomId) {
    return (
      <Card className="w-full h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-500">Chat not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b">
        {/* <CardTitle className="text-lg">Chat with {otherUser.name}</CardTitle> */}
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender.id === currentUser.id ? "justify-end" : "justify-start"
                }`}
            >
              <div className="flex items-end gap-2 max-w-[80%]">
                {msg.sender.id !== currentUser.id && (
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={msg.sender.image || undefined} />
                    <AvatarFallback>
                      {msg.sender.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 ${msg.sender.id === currentUser.id
                    ? "bg-[#678983] text-white"
                    : "bg-gray-100"
                    }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {format(new Date(msg.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-[#678983] hover:bg-[#678983]/90 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
} 
