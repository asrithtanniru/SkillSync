'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, X } from "lucide-react"
import { toast } from "sonner"

const popularSkills = [
  "React Development",
  "Python Programming",
  "UI/UX Design",
  "Digital Marketing",
  "Data Science",
  "Photography",
  "Spanish Language",
  "Guitar Playing",
  "Cooking",
  "Yoga",
  "Public Speaking",
  "Blockchain Development",
  "Content Writing",
  "Video Editing",
  "Machine Learning",
  "Graphic Design",
]

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(session?.user?.image || "")
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    location: "",
    teachingSkills: [] as string[],
    learningSkills: [] as string[],
    image: session?.user?.image || "",
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSkillToggle = (skill: string, type: 'teaching' | 'learning') => {
    setFormData(prev => {
      const skills = type === 'teaching' ? prev.teachingSkills : prev.learningSkills
      const newSkills = skills.includes(skill)
        ? skills.filter(s => s !== skill)
        : [...skills, skill]

      return {
        ...prev,
        [type === 'teaching' ? 'teachingSkills' : 'learningSkills']: newSkills
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // First upload image to Cloudinary if there's a new image
      let imageUrl = formData.image
      if (imageFile) {
        const cloudinaryFormData = new FormData()
        cloudinaryFormData.append('file', imageFile)
        cloudinaryFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!)

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: cloudinaryFormData,
          }
        )
        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.secure_url
      }

      // Then update user profile
      const response = await fetch('/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          image: imageUrl,
          teachingSkills: formData.teachingSkills,
          learningSkills: formData.learningSkills,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      // Update the session with onboardingCompleted flag
      console.log('Updating session...', {
        currentSession: session,
        newData: {
          ...session?.user,
          onboardingCompleted: true,
          image: imageUrl,
          name: formData.name,
        }
      })

      // First update the session
      await update({
        user: {
          ...session?.user,
          onboardingCompleted: true,
          image: imageUrl,
          name: formData.name,
        },
      })

      // Then make a request to update the session on the server
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          onboardingCompleted: true,
        }),
      })

      // Force a token refresh by signing out and back in
      await fetch('/api/auth/signout', { method: 'POST' })

      toast.success('Profile updated successfully!')

      // Redirect to sign in page which will then redirect to dashboard
      window.location.href = '/auth/signin'

    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F0E9D2] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white border-[#E6DDC4]">
          <CardHeader>
            <CardTitle className="text-[#181D31]">Complete Your Profile</CardTitle>
            <CardDescription className="text-[#181D31]/70">
              Tell us about yourself and your skills to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={imagePreview} />
                    <AvatarFallback className="text-2xl">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 p-1 bg-[#678983] rounded-full cursor-pointer hover:bg-[#678983]/90"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#181D31]">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="border-[#E6DDC4]"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-[#181D31]">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="border-[#E6DDC4]"
                  placeholder="City, Country"
                  required
                />
              </div>

              {/* Teaching Skills */}
              <div className="space-y-2">
                <Label className="text-[#181D31]">Skills You Can Teach</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.teachingSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer ${formData.teachingSkills.includes(skill)
                        ? "bg-[#678983] hover:bg-[#678983]/90 text-white"
                        : "border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white"
                        }`}
                      onClick={() => handleSkillToggle(skill, 'teaching')}
                    >
                      {skill}
                      {formData.teachingSkills.includes(skill) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Learning Skills */}
              <div className="space-y-2">
                <Label className="text-[#181D31]">Skills You Want to Learn</Label>
                <div className="flex flex-wrap gap-2">
                  {popularSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.learningSkills.includes(skill) ? "default" : "outline"}
                      className={`cursor-pointer ${formData.learningSkills.includes(skill)
                        ? "bg-[#678983] hover:bg-[#678983]/90 text-white"
                        : "border-[#678983] text-[#678983] hover:bg-[#678983] hover:text-white"
                        }`}
                      onClick={() => handleSkillToggle(skill, 'learning')}
                    >
                      {skill}
                      {formData.learningSkills.includes(skill) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#678983] hover:bg-[#678983]/90 text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Complete Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
