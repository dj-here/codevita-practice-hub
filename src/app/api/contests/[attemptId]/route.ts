import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { attemptId } = params;

    const attempt = await prisma.contestAttempt.findUnique({
      where: { id: attemptId },
      include: {
        contest: {
          include: {
            contestProblems: {
              include: {
                problem: {
                  select: {
                    id: true,
                    slug: true,
                    title: true,
                    difficulty: true,
                    statement: true,
                    inputFormat: true,
                    outputFormat: true,
                    constraints: true,
                    timeLimitMs: true,
                    memoryLimitKb: true,
                    editorial: true,
                    testCases: {
                      where: { isSample: true },
                      select: {
                        id: true,
                        input: true,
                        expectedOutput: true,
                        explanation: true,
                        orderIndex: true,
                      },
                      orderBy: { orderIndex: 'asc' },
                    },
                    // Notice: hiddenCases are strictly excluded!
                  },
                },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
        submissions: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            problemId: true,
            language: true,
            verdict: true,
            executionTimeMs: true,
            passedCases: true,
            totalCases: true,
            createdAt: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Contest attempt not found' }, { status: 404 });
    }

    if (attempt.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Server-Authoritative Timer Check
    const now = Date.now();
    const endsAtMs = attempt.endsAt.getTime();
    let status = attempt.status;

    if (now >= endsAtMs && status === 'IN_PROGRESS') {
      status = 'TIMED_OUT';
      const durationSec = Math.floor((endsAtMs - attempt.startedAt.getTime()) / 1000);
      await prisma.contestAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'TIMED_OUT',
          submittedAt: attempt.endsAt,
          totalTimeSpentSec: durationSec,
        },
      });
    }

    const remainingSeconds = Math.max(0, Math.floor((endsAtMs - now) / 1000));

    // Per-problem status in this attempt
    const problemStatusMap: Record<string, { solved: boolean; bestVerdict: string; attempts: number }> = {};
    attempt.contest.contestProblems.forEach((cp) => {
      problemStatusMap[cp.problem.id] = { solved: false, bestVerdict: 'UNATTEMPTED', attempts: 0 };
    });

    attempt.submissions.forEach((sub) => {
      const p = problemStatusMap[sub.problemId];
      if (p) {
        p.attempts++;
        if (sub.verdict === 'ACCEPTED') {
          p.solved = true;
          p.bestVerdict = 'ACCEPTED';
        } else if (!p.solved) {
          p.bestVerdict = sub.verdict;
        }
      }
    });

    // Scoreboard against user's past attempts
    const userPastAttempts = await prisma.contestAttempt.findMany({
      where: {
        userId,
        status: { in: ['COMPLETED', 'TIMED_OUT'] },
        id: { not: attempt.id },
      },
      orderBy: { score: 'desc' },
      take: 5,
      select: {
        id: true,
        score: true,
        totalTimeSpentSec: true,
        startedAt: true,
        contest: { select: { title: true } },
      },
    });

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        contestId: attempt.contestId,
        contestTitle: attempt.contest.title,
        durationMinutes: attempt.contest.durationMinutes,
        startedAt: attempt.startedAt,
        endsAt: attempt.endsAt,
        remainingSeconds,
        status,
        score: attempt.score,
        totalTimeSpentSec: attempt.totalTimeSpentSec,
      },
      problems: attempt.contest.contestProblems.map((cp) => ({
        problemId: cp.problem.id,
        slug: cp.problem.slug,
        title: cp.problem.title,
        difficulty: cp.problem.difficulty,
        statement: cp.problem.statement,
        inputFormat: cp.problem.inputFormat,
        outputFormat: cp.problem.outputFormat,
        constraints: cp.problem.constraints,
        timeLimitMs: cp.problem.timeLimitMs,
        memoryLimitKb: cp.problem.memoryLimitKb,
        editorial: status !== 'IN_PROGRESS' ? cp.problem.editorial : null, // reveal only after contest
        sampleCases: cp.problem.testCases,
        points: cp.points,
        orderIndex: cp.orderIndex,
        solved: problemStatusMap[cp.problem.id]?.solved || false,
        bestVerdict: problemStatusMap[cp.problem.id]?.bestVerdict || 'UNATTEMPTED',
        attemptsCount: problemStatusMap[cp.problem.id]?.attempts || 0,
      })),
      submissions: attempt.submissions,
      pastScoreboard: userPastAttempts,
    });
  } catch (error: any) {
    console.error('Fetch contest attempt error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contest attempt' },
      { status: 500 }
    );
  }
}
