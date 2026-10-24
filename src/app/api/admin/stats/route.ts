import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const [
      totalProblems,
      publishedProblems,
      totalTestCases,
      totalSubmissions,
      totalUsers,
      totalContests,
      totalInterviews,
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.count({ where: { isPublished: true } }),
      prisma.testCase.count(),
      prisma.submission.count(),
      prisma.user.count(),
      prisma.contest.count(),
      prisma.interviewSession.count(),
    ]);

    // Submissions breakdown by verdict
    const verdicts = await prisma.submission.groupBy({
      by: ['verdict'],
      _count: { id: true },
    });

    return NextResponse.json({
      stats: {
        totalProblems,
        publishedProblems,
        draftProblems: totalProblems - publishedProblems,
        totalTestCases,
        totalSubmissions,
        totalUsers,
        totalContests,
        totalInterviews,
        verdicts: verdicts.map((v) => ({
          verdict: v.verdict,
          count: v._count.id,
        })),
      },
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve administrative statistics' },
      { status: 500 }
    );
  }
}
