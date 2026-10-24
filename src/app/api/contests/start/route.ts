import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const startContestSchema = z.object({
  presetType: z.enum(['STANDARD_90', 'STANDARD_180', 'CUSTOM']),
  durationMinutes: z.number().int().min(15).max(300).optional(),
  problemCount: z.number().int().min(1).max(10).optional(),
  difficultyMix: z
    .object({
      EASY: z.number().int().min(0).default(1),
      MEDIUM: z.number().int().min(0).default(1),
      HARD: z.number().int().min(0).default(1),
    })
    .optional(),
});

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json().catch(() => ({}));
    const parseResult = startContestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid contest parameters', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { presetType } = parseResult.data;

    let durationMinutes = 90;
    let contestTitle = 'MockVita Sprint Contest';
    let difficultyMix = { EASY: 1, MEDIUM: 1, HARD: 1 };

    if (presetType === 'STANDARD_90') {
      durationMinutes = 90;
      contestTitle = 'MockVita 90-Min Sprint';
      difficultyMix = { EASY: 1, MEDIUM: 1, HARD: 1 };
    } else if (presetType === 'STANDARD_180') {
      durationMinutes = 180;
      contestTitle = 'TCS CodeVita Pre-Qualifier Simulation';
      difficultyMix = { EASY: 2, MEDIUM: 3, HARD: 1 };
    } else if (presetType === 'CUSTOM') {
      durationMinutes = parseResult.data.durationMinutes || 90;
      difficultyMix = parseResult.data.difficultyMix || { EASY: 1, MEDIUM: 1, HARD: 1 };
      contestTitle = `Custom Mock Contest (${durationMinutes}m)`;
    }

    // 1. Fetch user's already solved problem IDs to exclude them if possible
    const solvedRecords = await prisma.userProgress.findMany({
      where: { userId, solved: true },
      select: { problemId: true },
    });
    const solvedIds = new Set(solvedRecords.map((r) => r.problemId));

    // 2. Select problems for each difficulty tier
    const selectedProblemIds: string[] = [];

    for (const [diff, count] of Object.entries(difficultyMix)) {
      if (count <= 0) continue;

      // First query: published problems in this difficulty NOT solved by user
      const candidateProblems = await prisma.problem.findMany({
        where: {
          difficulty: diff,
          isPublished: true,
          id: { notIn: Array.from(solvedIds).concat(selectedProblemIds) },
        },
        select: { id: true },
      });

      let chosen = shuffleArray(candidateProblems).slice(0, count);

      // If not enough unsolved problems, fill remainder from general published pool of this difficulty
      if (chosen.length < count) {
        const remainingNeeded = count - chosen.length;
        const fallbackCandidates = await prisma.problem.findMany({
          where: {
            difficulty: diff,
            isPublished: true,
            id: { notIn: selectedProblemIds.concat(chosen.map((c) => c.id)) },
          },
          select: { id: true },
        });
        const fallbackChosen = shuffleArray(fallbackCandidates).slice(0, remainingNeeded);
        chosen = chosen.concat(fallbackChosen);
      }

      chosen.forEach((p) => selectedProblemIds.push(p.id));
    }

    if (selectedProblemIds.length === 0) {
      return NextResponse.json(
        { error: 'Insufficient problems available to create contest' },
        { status: 500 }
      );
    }

    // 3. Create unique Contest record
    const timestamp = Date.now();
    const contestSlug = `mock-${presetType.toLowerCase()}-${timestamp}`;
    const contest = await prisma.contest.create({
      data: {
        slug: contestSlug,
        title: `${contestTitle} #${Math.floor(timestamp / 1000).toString().slice(-4)}`,
        description: `Timed algorithmic contest simulation with ${selectedProblemIds.length} challenges.`,
        durationMinutes,
        presetType,
        isPublished: true,
        contestProblems: {
          create: selectedProblemIds.map((probId, idx) => ({
            problemId: probId,
            points: 100,
            orderIndex: idx + 1,
          })),
        },
      },
      include: {
        contestProblems: {
          include: {
            problem: {
              select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
              },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    // 4. Create ContestAttempt with server-authoritative timer
    const startedAt = new Date();
    const endsAt = new Date(startedAt.getTime() + durationMinutes * 60 * 1000);

    const attempt = await prisma.contestAttempt.create({
      data: {
        contestId: contest.id,
        userId,
        startedAt,
        endsAt,
        status: 'IN_PROGRESS',
        score: 0,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      contestId: contest.id,
      contestTitle: contest.title,
      durationMinutes,
      startedAt: attempt.startedAt,
      endsAt: attempt.endsAt,
      problems: contest.contestProblems.map((cp) => ({
        problemId: cp.problem.id,
        slug: cp.problem.slug,
        title: cp.problem.title,
        difficulty: cp.problem.difficulty,
        points: cp.points,
        orderIndex: cp.orderIndex,
      })),
    });
  } catch (error: any) {
    console.error('Start contest error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate mock contest' },
      { status: 500 }
    );
  }
}
