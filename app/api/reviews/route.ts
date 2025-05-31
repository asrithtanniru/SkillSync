import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sessionId, teacherAddress, learnerAddress, rating, comment, skillRatings } = body;

    if (!sessionId || !teacherAddress || !learnerAddress || !rating || !skillRatings) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        sessionId,
        userId: learnerAddress, // The learner is the one giving the review
        rating,
        feedback: comment,
        skillEvaluations: {
          create: skillRatings.map((skillRating: { skillId: string; rating: number }) => ({
            skillId: skillRating.skillId,
            rating: skillRating.rating
          }))
        }
      },
      include: {
        skillEvaluations: true
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
} 
