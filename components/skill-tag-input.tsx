"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"

interface SkillTagInputProps {
  skills: string[]
  onSkillsChange: (skills: string[]) => void
  placeholder?: string
  suggestions?: string[]
  maxSkills?: number
  className?: string
}

export default function SkillTagInput({
  skills,
  onSkillsChange,
  placeholder = "Add a skill...",
  suggestions = [],
  maxSkills = 10,
  className = "",
}: SkillTagInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        (suggestion) => suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !skills.includes(suggestion),
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue, suggestions, skills])

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim()
    if (trimmedSkill && !skills.includes(trimmedSkill) && skills.length < maxSkills) {
      onSkillsChange([...skills, trimmedSkill])
      setInputValue("")
      setShowSuggestions(false)
    }
  }

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(inputValue)
    } else if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 mb-3">
        {skills.map((skill) => (
          <Badge key={skill} className="bg-[#678983]/10 text-[#678983] hover:bg-[#678983] hover:text-white group">
            {skill}
            <button onClick={() => removeSkill(skill)} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={skills.length >= maxSkills ? `Maximum ${maxSkills} skills` : placeholder}
            disabled={skills.length >= maxSkills}
            className="border-[#E6DDC4] focus:border-[#678983]"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-[#E6DDC4] rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => addSkill(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-[#F0E9D2] text-[#181D31] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={() => addSkill(inputValue)}
          disabled={!inputValue.trim() || skills.length >= maxSkills}
          size="sm"
          className="bg-[#678983] hover:bg-[#678983]/90 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-[#181D31]/50 mt-1">
        {skills.length}/{maxSkills} skills added
      </p>
    </div>
  )
}
