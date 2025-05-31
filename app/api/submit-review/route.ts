import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, review } = await req.json();

    // Save db
    const savedReview = await prisma.review.create({
      data: {
        sessionId,
        userId: review.userId,
        rating: review.rating,
        feedback: review.feedback,
        timestamp: new Date(review.timestamp)
      }
    });

    return NextResponse.json({ success: true, review: savedReview });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save review' },
      { status: 500 }
    );
  }
} 
