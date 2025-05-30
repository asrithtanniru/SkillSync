"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Video, MessageCircle, Heart, Users, CheckCircle } from "lucide-react"

interface UserMatchCardProps {
  user: {
    id: number
    name: string
    avatar: string
    location: string
    rating: number
    reviewCount: number
    teachingSkills: string[]
    learningSkills: string[]
    bio: string
    availability: string
    timezone: string
    isOnline: boolean
    responseTime: string
    matchPercentage?: number
  }
  onConnect?: (userId: number) => void
  onMessage?: (userId: number) => void
  onFavorite?: (userId: number) => void
  showMatchPercentage?: boolean
}

export default function UserMatchCard({
  user,
  onConnect,
  onMessage,
  onFavorite,
  showMatchPercentage = false,
}: UserMatchCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await onConnect?.(user.id)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    onFavorite?.(user.id)
  }

  return (
    <Card className="bg-white border-[#E6DDC4] hover:shadow-lg transition-all duration-300 group">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {user.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              )}
              {showMatchPercentage && user.matchPercentage && (
                <div className="absolute -top-2 -right-2 bg-[#678983] text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                  {user.matchPercentage}%
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-xl font-semibold text-[#181D31]">{user.name}</h3>
                {user.isOnline && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Online
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-[#181D31]/70 mb-2">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{user.rating}</span>
                  <span>({user.reviewCount})</span>
                </div>
              </div>
              <p className="text-xs text-[#181D31]/50">{user.responseTime}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            className={`transition-colors ${isFavorited ? "text-red-500 hover:text-red-600" : "text-[#678983] hover:text-red-500"}`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-[#181D31]/80 text-sm line-clamp-2">{user.bio}</p>

        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-[#181D31] mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-[#678983]" />
              Can Teach:
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.teachingSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} className="bg-[#678983]/10 text-[#678983] text-xs">
                  {skill}
                </Badge>
              ))}
              {user.teachingSkills.length > 3 && (
                <Badge variant="outline" className="text-xs border-[#E6DDC4] text-[#181D31]/50">
                  +{user.teachingSkills.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#181D31] mb-2 flex items-center">
              <Users className="w-4 h-4 mr-1 text-[#678983]" />
              Wants to Learn:
            </h4>
            <div className="flex flex-wrap gap-1">
              {user.learningSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="border-[#E6DDC4] text-[#181D31]/70 text-xs">
                  {skill}
                </Badge>
              ))}
              {user.learningSkills.length > 3 && (
                <Badge variant="outline" className="text-xs border-[#E6DDC4] text-[#181D31]/50">
                  +{user.learningSkills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#E6DDC4]">
          <div className="flex items-center space-x-3 text-xs text-[#181D31]/70">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{user.availability}</span>
            </div>
            <span>•</span>
            <span>{user.timezone}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage?.(user.id)}
              className="border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-[#678983] hover:bg-[#678983]/90 text-white"
            >
              <Video className="w-3 h-3 mr-1" />
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
