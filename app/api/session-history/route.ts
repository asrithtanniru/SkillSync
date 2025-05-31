import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Get all reviews and token rewards for the user
    const reviews = await prisma.review.findMany({
      where: {
        userId
      },
      include: {
        skillEvaluations: {
          include: {
            skill: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    const tokenRewards = await prisma.tokenReward.findMany({
      where: {
        teacherAddress: userId
      },
      orderBy: {
        timestamp: 'desc'
      }
    });

    // Combine and sort the data
    const history = [
      ...reviews.map(review => ({
        type: 'review',
        data: review,
        timestamp: review.timestamp
      })),
      ...tokenRewards.map(reward => ({
        type: 'reward',
        data: reward,
        timestamp: reward.timestamp
      }))
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching session history:", error);
    return NextResponse.json(
      { message: "Failed to fetch session history" },
      { status: 500 }
    );
  }
} 
