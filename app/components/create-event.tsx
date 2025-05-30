import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateEventProps {
  onSubmit: (event: any) => void
}

export function CreateEvent({ onSubmit }: CreateEventProps) {
  const [eventType, setEventType] = useState<"learn" | "teach">("learn")
  const [skill, setSkill] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [duration, setDuration] = useState("")
  const [level, setLevel] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      type: eventType,
      skill,
      description,
      date,
      time,
      duration,
      level,
    })
  }

  return (
    <Card className="bg-white border-[#E6DDC4]">
      <CardHeader>
        <CardTitle className="text-[#181D31]">Create New Event</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <Button
              type="button"
              variant={eventType === "learn" ? "default" : "outline"}
              className={cn(
                "flex-1",
                eventType === "learn" ? "bg-[#678983] hover:bg-[#678983]/90" : "border-[#678983] text-[#678983]"
              )}
              onClick={() => setEventType("learn")}
            >
              I Want to Learn
            </Button>
            <Button
              type="button"
              variant={eventType === "teach" ? "default" : "outline"}
              className={cn(
                "flex-1",
                eventType === "teach" ? "bg-[#678983] hover:bg-[#678983]/90" : "border-[#678983] text-[#678983]"
              )}
              onClick={() => setEventType("teach")}
            >
              I Want to Teach
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#181D31]">Skill</label>
            <Input
              placeholder={eventType === "learn" ? "What do you want to learn?" : "What can you teach?"}
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="border-[#E6DDC4]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#181D31]">Description</label>
            <Textarea
              placeholder="Describe your learning goals or teaching experience..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-[#E6DDC4]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181D31]">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181D31]">Time</label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-[#E6DDC4]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181D31]">Duration</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="border-[#E6DDC4]">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181D31]">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="border-[#E6DDC4]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#678983] hover:bg-[#678983]/90">
            Create Event
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 
