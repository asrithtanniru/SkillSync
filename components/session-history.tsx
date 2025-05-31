"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Coins } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface SessionHistoryProps {
  userId: string;
}

interface HistoryItem {
  type: 'review' | 'reward';
  data: any;
  timestamp: string;
}

export default function SessionHistory({ userId }: SessionHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/session-history?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#678983]" />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No session history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <Card key={index} className="bg-white border-[#E6DDC4]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-[#181D31]">
                {item.type === 'review' ? 'Session Review' : 'Token Reward'}
              </CardTitle>
              <span className="text-sm text-[#181D31]/70">
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {item.type === 'review' ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-[#181D31]">{item.data.rating}/5</span>
                </div>
                <p className="text-[#181D31]/80">{item.data.feedback}</p>
                {item.data.skillEvaluations.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-[#181D31]">Skill Ratings:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {item.data.skillEvaluations.map((evaluation: any) => (
                        <div key={evaluation.id} className="flex items-center justify-between">
                          <span className="text-sm text-[#181D31]/70">{evaluation.skill.name}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{evaluation.rating}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-[#678983]" />
                <span className="font-medium text-[#181D31]">
                  {item.data.amount} tokens earned
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
