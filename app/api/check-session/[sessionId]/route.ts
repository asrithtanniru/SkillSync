import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { sessionId: string } }) {
  const { sessionId } = params;

  try {
    const reviews = await prisma.review.findMany({
      where: { sessionId },
    });

    const bothReviewed = reviews.length === 2;
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return Response.json({
      bothReviewed,
      averageRating,
      reviews,
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} 
