import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock, MapPin, Star, Video } from "lucide-react"
import { format } from "date-fns"

interface EventCardProps {
  event: {
    id: string
    type: "learn" | "teach"
    skill: string
    description: string
    date: Date
    time: string
    duration: string
    level: string
    isRelevant: boolean
    user: {
      name: string
      avatar?: string
      location: string
      rating: number
      id: string
    }
  }
  onConnect: (eventId: string) => void
  onMessage: (eventId: string) => void
  connectionStatus?: "idle" | "pending" | "success" | "error"
}

export function EventCard({ event, onConnect, onMessage, connectionStatus = "idle" }: EventCardProps) {
  return (
    <Card className="bg-white border-[#E6DDC4] hover:border-[#678983] transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={event.user.avatar} />
              <AvatarFallback>{event.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-[#181D31]">{event.user.name}</p>
              <div className="flex items-center text-sm text-[#181D31]/70">
                <MapPin className="w-3 h-3 mr-1" />
                {event.user.location}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-[#181D31]">{event.user.rating.toFixed(1)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={`${event.type === "learn"
              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
              : "bg-green-100 text-green-700 hover:bg-green-100"
              }`}>
              {event.type === "learn" ? "Want to Learn" : "Want to Teach"}
            </Badge>
            {event.isRelevant && (
              <Badge className="bg-[#678983] text-white hover:bg-[#678983]">
                Matches Your Skills
              </Badge>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[#181D31] mb-1">{event.skill}</h3>
            <p className="text-[#181D31]/70 text-sm">{event.description}</p>
          </div>
          <div className="flex items-center justify-between text-sm text-[#181D31]/70">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {event.time} ({event.duration})
            </div>
            <Badge variant="outline" className="border-[#678983] text-[#678983]">
              {event.level}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              className="flex-1 bg-[#678983] hover:bg-[#678983]/90 text-white"
              onClick={() => onConnect(event.id)}
              disabled={connectionStatus === "pending" || connectionStatus === "success"}
            >
              <Video className="w-4 h-4 mr-2" />
              {connectionStatus === "pending"
                ? "Requesting..."
                : connectionStatus === "success"
                  ? "Requested"
                  : "Connect"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white"
              onClick={() => onMessage(event.id)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
