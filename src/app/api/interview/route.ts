import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const interviewSessions = await prisma.interviewSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        scorecard: {
          select: {
            overallScore: true,
            communicationScore: true,
            correctnessScore: true,
            problemSolvingScore: true,
            confidenceScore: true,
            isStaticFallback: true,
          },
        },
        messages: {
          select: { id: true },
        },
      },
    });

    return NextResponse.json({
      sessions: interviewSessions.map((s) => ({
        id: s.id,
        type: s.type,
        language: s.language,
        status: s.status,
        startedAt: s.startedAt,
        completedAt: s.completedAt,
        messageCount: s.messages.length,
        scorecard: s.scorecard,
      })),
    });
  } catch (error: any) {
    console.error('Fetch interview sessions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve interview sessions' },
      { status: 500 }
    );
  }
}
