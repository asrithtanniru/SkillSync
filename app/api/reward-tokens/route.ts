import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, teacherAddress, tokensRewarded } = await req.json();

    // Create a record of the token reward
    const reward = await prisma.tokenReward.create({
      data: {
        sessionId,
        teacherAddress,
        amount: tokensRewarded,
        timestamp: new Date()
      }
    });

    return NextResponse.json({ success: true, reward });
  } catch (error) {
    console.error('Error recording token reward:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record token reward' },
      { status: 500 }
    );
  }
} 
