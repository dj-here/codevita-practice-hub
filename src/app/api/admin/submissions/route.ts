import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const verdict = searchParams.get('verdict') || '';
    const language = searchParams.get('language') || '';
    const problemSlug = searchParams.get('problemSlug') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '25')));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (verdict) where.verdict = verdict.toUpperCase();
    if (language) where.language = language.toUpperCase();
    if (problemSlug) {
      where.problem = { slug: problemSlug };
    }

    const [submissions, totalCount] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          problem: {
            select: {
              id: true,
              slug: true,
              title: true,
              difficulty: true,
            },
          },
        },
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({
      submissions: submissions.map((s) => ({
        id: s.id,
        userEmail: s.user.email,
        userName: s.user.name,
        problemTitle: s.problem.title,
        problemSlug: s.problem.slug,
        difficulty: s.problem.difficulty,
        language: s.language,
        verdict: s.verdict,
        executionTimeMs: s.executionTimeMs,
        memoryKb: s.memoryKb,
        passedCases: s.passedCases,
        totalCases: s.totalCases,
        createdAt: s.createdAt,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin list submissions error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve submissions' },
      { status: 500 }
    );
  }
}
