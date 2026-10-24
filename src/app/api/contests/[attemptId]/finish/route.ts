import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;
    const { attemptId } = params;

    const attempt = await prisma.contestAttempt.findUnique({
      where: { id: attemptId },
      include: {
        contest: {
          include: {
            contestProblems: true,
          },
        },
        submissions: {
          where: { verdict: 'ACCEPTED' },
          select: { problemId: true },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Contest attempt not found' }, { status: 404 });
    }

    if (attempt.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const now = new Date();
    const solvedProblemIds = new Set(attempt.submissions.map((s) => s.problemId));
    let finalScore = 0;
    attempt.contest.contestProblems.forEach((cp) => {
      if (solvedProblemIds.has(cp.problemId)) {
        finalScore += cp.points;
      }
    });

    const totalTimeSpentSec = Math.min(
      attempt.contest.durationMinutes * 60,
      Math.max(0, Math.floor((now.getTime() - attempt.startedAt.getTime()) / 1000))
    );

    const updated = await prisma.contestAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        submittedAt: now,
        score: finalScore,
        totalTimeSpentSec,
      },
    });

    return NextResponse.json({
      success: true,
      score: updated.score,
      status: updated.status,
      totalTimeSpentSec: updated.totalTimeSpentSec,
      completedAt: updated.submittedAt,
    });
  } catch (error: any) {
    console.error('Finish contest error:', error);
    return NextResponse.json(
      { error: 'Failed to finalize contest attempt' },
      { status: 500 }
    );
  }
}
