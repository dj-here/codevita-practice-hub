import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Presets
    const presets = [
      {
        id: 'mockvita-sprint',
        title: 'MockVita Sprint',
        description: 'Rapid 90-minute competition with 3 algorithmic challenges (1 Easy, 1 Medium, 1 Hard). Perfect for daily contest conditioning.',
        durationMinutes: 90,
        problemCount: 3,
        presetType: 'STANDARD_90',
        difficultyDistribution: { EASY: 1, MEDIUM: 1, HARD: 1 },
      },
      {
        id: 'codevita-prequalifier',
        title: 'Pre-Qualifier Simulation',
        description: 'Comprehensive 180-minute full simulation with 6 problems (2 Easy, 3 Medium, 1 Hard). Replicates TCS CodeVita Round 1 under exact contest time pressure.',
        durationMinutes: 180,
        problemCount: 6,
        presetType: 'STANDARD_180',
        difficultyDistribution: { EASY: 2, MEDIUM: 3, HARD: 1 },
      },
    ];

    // Fetch user's past attempts if authenticated
    let userAttempts: any[] = [];
    if (userId) {
      userAttempts = await prisma.contestAttempt.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          contest: {
            select: {
              title: true,
              durationMinutes: true,
              presetType: true,
            },
          },
          submissions: {
            select: {
              id: true,
              problemId: true,
              verdict: true,
              createdAt: true,
            },
          },
        },
      });
    }

    const response = NextResponse.json({
      presets,
      pastAttempts: userAttempts.map((att) => ({
        id: att.id,
        contestTitle: att.contest.title,
        durationMinutes: att.contest.durationMinutes,
        presetType: att.contest.presetType,
        score: att.score,
        status: att.status,
        startedAt: att.startedAt,
        endsAt: att.endsAt,
        submittedAt: att.submittedAt,
        totalTimeSpentSec: att.totalTimeSpentSec,
        submissionCount: att.submissions.length,
      })),
    });

    if (!userId) {
      response.headers.set(
        'Cache-Control',
        'public, s-maxage=120, stale-while-revalidate=600'
      );
    }

    return response;
  } catch (error: any) {
    console.error('Contest list API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve contest presets' },
      { status: 500 }
    );
  }
}
