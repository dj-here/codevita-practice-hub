import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { sessionId } = params;

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            role: true,
            content: true,
            orderIndex: true,
            createdAt: true,
          },
        },
        scorecard: true,
      },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    // STRICT PRIVACY: Transcripts are stored for the student only
    if (interviewSession.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-xxx');

    // Parse JSON scorecard fields if scorecard exists
    let formattedScorecard = null;
    if (interviewSession.scorecard) {
      const sc = interviewSession.scorecard;
      let strengths = [];
      let gaps = [];
      let sevenDayPlan = [];
      try {
        strengths = JSON.parse(sc.strengths);
      } catch {
        strengths = [sc.strengths];
      }
      try {
        gaps = JSON.parse(sc.gaps);
      } catch {
        gaps = [sc.gaps];
      }
      try {
        sevenDayPlan = JSON.parse(sc.sevenDayPlan);
      } catch {
        sevenDayPlan = [];
      }

      formattedScorecard = {
        id: sc.id,
        overallScore: sc.overallScore,
        communicationScore: sc.communicationScore,
        correctnessScore: sc.correctnessScore,
        problemSolvingScore: sc.problemSolvingScore,
        confidenceScore: sc.confidenceScore,
        strengths,
        gaps,
        sevenDayPlan,
        transcriptSummary: sc.transcriptSummary,
        isStaticFallback: sc.isStaticFallback,
        createdAt: sc.createdAt,
      };
    }

    return NextResponse.json({
      session: {
        id: interviewSession.id,
        type: interviewSession.type,
        language: interviewSession.language,
        status: interviewSession.status,
        startedAt: interviewSession.startedAt,
        completedAt: interviewSession.completedAt,
      },
      messages: interviewSession.messages,
      scorecard: formattedScorecard,
      isStaticFallback: interviewSession.scorecard ? interviewSession.scorecard.isStaticFallback : !hasAnthropicKey,
    });
  } catch (error: any) {
    console.error('Fetch interview session error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve interview session' },
      { status: 500 }
    );
  }
}
