import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { sessionId, review, skillEvaluations } = await req.json();

    // Save review with skill evaluations
    const savedReview = await prisma.review.create({
      data: {
        sessionId,
        userId: review.userId,
        rating: review.rating,
        feedback: review.feedback,
        timestamp: new Date(review.timestamp),
        skillEvaluations: {
          create: skillEvaluations.map((evaluation: any) => ({
            skillId: evaluation.skillId,
            rating: evaluation.rating,
            feedback: evaluation.feedback
          }))
        }
      },
      include: {
        skillEvaluations: {
          include: {
            skill: true
          }
        }
      }
    });

    // Calculate average skill ratings for the user
    const userSkills = await prisma.skillEvaluation.groupBy({
      by: ['skillId'],
      where: {
        review: {
          userId: review.userId
        }
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    // Update user's skill ratings in the database
    for (const skill of userSkills) {
      if (skill._avg.rating) {
        await prisma.skill.update({
          where: { id: skill.skillId },
          data: {
            averageRating: skill._avg.rating,
            ratingCount: skill._count.rating
          }
        });
      }
    }

    return NextResponse.json({ success: true, review: savedReview });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save review' },
      { status: 500 }
    );
  }
} 
