"use client"

import { useState } from 'react';
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import ReviewForm from './review-form';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import SessionHistory from './session-history';

interface Skill {
  id: string;
  name: string;
}

interface SessionData {
  id: string;
  teacherAddress: string;
  learnerAddress: string;
  duration: number;
  subject: string;
  skills: Skill[];
  connectionMessage?: string;
}

interface Review {
  rating: number;
  comment: string;
  skillRatings: { [key: string]: number };
}

interface RewardSystemProps {
  sessionData: SessionData;
  onReviewSubmit?: () => void;
}

export default function RewardSystem({ sessionData, onReviewSubmit }: RewardSystemProps) {
  const [isRewarding, setIsRewarding] = useState(false);
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  // Calculate tokens based on session duration (2 tokens per minute for demo)
  const tokensRewarded = Math.floor(sessionData.duration * 2);

  const handleSkillRating = (skillId: string, rating: number) => {
    setSkillRatings(prev => ({
      ...prev,
      [skillId]: rating
    }));
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast({
        title: "Rating Required",
        description: "Please provide an overall rating for the session.",
        variant: "destructive"
      });
      return;
    }

    // Check if all skills have been rated
    const allSkillsRated = sessionData.skills.every(skill => skillRatings[skill.id]);
    if (!allSkillsRated) {
      toast({
        title: "Skill Ratings Required",
        description: "Please rate all skills taught in the session.",
        variant: "destructive"
      });
      return;
    }

    setIsRewarding(true);

    try {
      // Submit the review
      const reviewResponse = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: sessionData.id,
          teacherAddress: sessionData.teacherAddress,
          learnerAddress: sessionData.learnerAddress,
          rating: overallRating,
          comment,
          skillRatings: Object.entries(skillRatings).map(([skillId, rating]) => ({
            skillId,
            rating
          }))
        })
      });

      if (!reviewResponse.ok) {
        const errorData = await reviewResponse.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      // Record the token reward
      const rewardResponse = await fetch("/api/reward-tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId: sessionData.id,
          teacherAddress: sessionData.teacherAddress,
          tokensRewarded
        })
      });

      if (!rewardResponse.ok) {
        const errorData = await rewardResponse.json();
        throw new Error(errorData.message || "Failed to record token reward");
      }

      toast({
        title: "Success",
        description: `Review submitted and ${tokensRewarded} tokens recorded successfully!`
      });

      // Call the onReviewSubmit callback if provided
      if (onReviewSubmit) {
        onReviewSubmit();
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRewarding(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Review Submitted Successfully!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#181D31]/80 mb-4">
              Thank you for your feedback. Your review and token reward have been recorded.
            </p>
            <SessionHistory userId={sessionData.learnerAddress} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Session Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Rating */}
          <div className="space-y-2">
            <Label>Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setOverallRating(rating)}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    overallRating >= rating
                      ? "text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  )}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Skill Ratings */}
          <div className="space-y-4">
            <Label>Skill Ratings</Label>
            {sessionData.skills.map((skill) => (
              <div key={skill.id} className="space-y-2">
                <Label className="text-sm">{skill.name}</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleSkillRating(skill.id, rating)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        skillRatings[skill.id] >= rating
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-400"
                      )}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label>Additional Comments</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this session..."
              className="min-h-[100px]"
            />
          </div>

          {/* Token Reward */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-medium text-green-800">Token Reward</h3>
            <p className="text-green-600">
              {tokensRewarded} tokens will be recorded for this {sessionData.duration}-minute session
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isRewarding}
            className="w-full"
          >
            {isRewarding ? "Submitting..." : "Submit Review"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 
