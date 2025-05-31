import { useState } from 'react';
import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import ReviewForm from './review-form';

interface SessionData {
  id: string;
  teacherAddress: string;
  learnerAddress: string;
  duration: number;
  subject: string;
}

interface RewardSystemProps {
  sessionData: SessionData;
}

export default function RewardSystem({ sessionData }: RewardSystemProps) {
  const address = useAddress();
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { mutateAsync: transfer } = useContractWrite(contract, "transfer");

  const [isRewarding, setIsRewarding] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviews, setReviews] = useState<Record<string, any>>({});

  const submitReview = async (rating: number, feedback: string) => {
    const review = {
      userId: address,
      rating,
      feedback,
      timestamp: Date.now()
    };

    try {
      // Save to your database
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionData.id,
          review
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      setReviews(prev => ({ ...prev, [address!]: review }));
      await checkSessionComplete();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const checkSessionComplete = async () => {
    try {
      const response = await fetch(`/api/check-session/${sessionData.id}`);
      const data = await response.json();

      if (data.bothReviewed && data.averageRating >= 3) {
        setSessionComplete(true);
        await rewardTokens();
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const rewardTokens = async () => {
    setIsRewarding(true);

    try {
      const teacherAddress = sessionData.teacherAddress;
      const sessionHours = Math.floor(sessionData.duration / 60); // Convert minutes to hours
      const tokensToReward = sessionHours * 1; // 1 token per hour

      // Transfer tokens from your main wallet to teacher
      await transfer({
        args: [teacherAddress, tokensToReward.toString()]
      });

      // Update database
      await fetch('/api/reward-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionData.id,
          teacherAddress,
          tokensRewarded: tokensToReward
        })
      });

      alert(`🎉 ${tokensToReward} SST tokens rewarded!`);

    } catch (error) {
      console.error('Reward failed:', error);
      alert('Failed to reward tokens. Please try again.');
    } finally {
      setIsRewarding(false);
    }
  };

  return (
    <div className="reward-system bg-gray-50 p-5 rounded-lg my-4">
      <h3 className="text-xl font-semibold mb-4">Session Complete</h3>

      {!sessionComplete ? (
        <div className="review-section">
          <h4 className="text-lg mb-2">Rate your learning experience (1-5):</h4>
          <ReviewForm onSubmit={submitReview} />
          <p className="text-gray-600 mt-2">⏳ Waiting for both participants to review...</p>
        </div>
      ) : (
        <div className="reward-section">
          <p className="text-green-600 font-medium">✅ Session verified!</p>
          {isRewarding ? (
            <p className="mt-2">🪙 Rewarding tokens...</p>
          ) : (
            <p className="mt-2 text-green-600">🎉 Tokens rewarded successfully!</p>
          )}
        </div>
      )}
    </div>
  );
} 
