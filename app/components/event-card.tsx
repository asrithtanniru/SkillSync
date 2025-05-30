import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Clock, MapPin, Star } from "lucide-react"
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
    user: {
      name: string
      avatar?: string
      location: string
      rating: number
    }
  }
  onConnect: (eventId: string) => void
  onMessage: (eventId: string) => void
}

export function EventCard({ event, onConnect, onMessage }: EventCardProps) {
  return (
    <Card className="bg-white border-[#E6DDC4] hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={event.user.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {event.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-[#181D31]">{event.user.name}</h3>
                <Badge
                  variant="secondary"
                  className={event.type === "learn" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                >
                  {event.type === "learn" ? "Wants to Learn" : "Can Teach"}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-[#181D31]/70 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{event.user.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{event.user.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-[#181D31] mb-1">{event.skill}</h4>
            <p className="text-sm text-[#181D31]/70">{event.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-[#678983] text-[#678983]">
              {event.level}
            </Badge>
            <Badge variant="outline" className="border-[#678983] text-[#678983]">
              {event.duration} min
            </Badge>
          </div>

          <div className="flex items-center space-x-2 text-sm text-[#181D31]/70">
            <Clock className="w-4 h-4" />
            <span>
              {format(event.date, "MMM d, yyyy")} at {event.time}
            </span>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-[#678983] text-[#678983]"
              onClick={() => onMessage(event.id)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-[#678983] hover:bg-[#678983]/90 text-white"
              onClick={() => onConnect(event.id)}
            >
              Connect
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
