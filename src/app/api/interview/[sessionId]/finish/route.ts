import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateStaticScorecard } from '@/lib/interview/static-engine';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;
    const { sessionId } = params;

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: { orderBy: { orderIndex: 'asc' } },
        scorecard: true,
      },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    if (interviewSession.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (interviewSession.scorecard) {
      return NextResponse.json({
        success: true,
        scorecardId: interviewSession.scorecard.id,
      });
    }

    // Generate scorecard from current transcript messages
    const sc = generateStaticScorecard(
      interviewSession.type as 'TECHNICAL' | 'MANAGERIAL_HR',
      interviewSession.messages,
      interviewSession.language
    );

    const scorecard = await prisma.interviewScorecard.create({
      data: {
        sessionId,
        overallScore: sc.overallScore,
        communicationScore: sc.communicationScore,
        correctnessScore: sc.correctnessScore,
        problemSolvingScore: sc.problemSolvingScore,
        confidenceScore: sc.confidenceScore,
        strengths: JSON.stringify(sc.strengths),
        gaps: JSON.stringify(sc.gaps),
        sevenDayPlan: JSON.stringify(sc.sevenDayPlan),
        transcriptSummary: sc.transcriptSummary,
        isStaticFallback: sc.isStaticFallback,
      },
    });

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      scorecardId: scorecard.id,
      overallScore: scorecard.overallScore,
    });
  } catch (error: any) {
    console.error('Finish interview error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize interview session' },
      { status: 500 }
    );
  }
}
