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

    // 1. Fetch user progress records
    const progressList = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            problemTags: {
              select: {
                tag: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    // 2. Fetch all published problems for totals
    const allProblems = await prisma.problem.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        difficulty: true,
        problemTags: {
          select: {
            tag: {
              select: { name: true },
            },
          },
        },
      },
    });

    // 3. Difficulty stats
    const difficultyCounts = {
      EASY: { solved: 0, total: 0, attempted: 0 },
      MEDIUM: { solved: 0, total: 0, attempted: 0 },
      HARD: { solved: 0, total: 0, attempted: 0 },
    };

    allProblems.forEach((p) => {
      const diff = p.difficulty as 'EASY' | 'MEDIUM' | 'HARD';
      if (difficultyCounts[diff]) {
        difficultyCounts[diff].total++;
      }
    });

    let totalSolved = 0;
    let totalAttempted = 0;

    const solvedProblemIds = new Set<string>();
    const attemptedProblemIds = new Set<string>();

    progressList.forEach((prog) => {
      const diff = prog.problem.difficulty as 'EASY' | 'MEDIUM' | 'HARD';
      if (prog.solved) {
        totalSolved++;
        solvedProblemIds.add(prog.problemId);
        if (difficultyCounts[diff]) difficultyCounts[diff].solved++;
      }
      if (prog.attempted) {
        totalAttempted++;
        attemptedProblemIds.add(prog.problemId);
        if (difficultyCounts[diff]) difficultyCounts[diff].attempted++;
      }
    });

    // 4. Topic mastery stats
    const topicStats: Record<string, { total: number; solved: number; attempted: number }> = {};

    allProblems.forEach((p) => {
      p.problemTags.forEach((pt) => {
        const topicName = pt.tag.name;
        if (!topicStats[topicName]) {
          topicStats[topicName] = { total: 0, solved: 0, attempted: 0 };
        }
        topicStats[topicName].total++;
        if (solvedProblemIds.has(p.id)) {
          topicStats[topicName].solved++;
        }
        if (attemptedProblemIds.has(p.id)) {
          topicStats[topicName].attempted++;
        }
      });
    });

    const topicMastery = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      total: stats.total,
      solved: stats.solved,
      attempted: stats.attempted,
      percentage: stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0,
    })).sort((a, b) => b.total - a.total);

    // 5. Weak topic recommendations (topics where attempted > solved or lowest completion)
    const weakTopics = [...topicMastery]
      .filter((t) => t.total > 0)
      .sort((a, b) => {
        const diffA = a.attempted - a.solved;
        const diffB = b.attempted - b.solved;
        if (diffB !== diffA) return diffB - diffA; // higher un-solved attempts first
        return a.percentage - b.percentage; // lower completion % first
      })
      .slice(0, 3);

    // 6. Recent submissions
    const recentSubmissions = await prisma.submission.findMany({
      where: { userId },
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
      },
    });

    // 7. Calculate submission streak (consecutive days of submissions)
    const distinctDates = await prisma.submission.findMany({
      where: { userId },
      select: { createdAt: true },
      orderBy: { createdAt: 'desc' },
    });

    const submissionDays = new Set(
      distinctDates.map((d) => d.createdAt.toISOString().slice(0, 10))
    );

    let streak = 0;
    const today = new Date();
    let currentCheck = new Date(today);

    // If no submission today, check if yesterday was active
    const todayStr = currentCheck.toISOString().slice(0, 10);
    if (!submissionDays.has(todayStr)) {
      currentCheck.setDate(currentCheck.getDate() - 1);
    }

    while (submissionDays.has(currentCheck.toISOString().slice(0, 10))) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    }

    // 8. Contest attempts
    const contestAttempts = await prisma.contestAttempt.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        contest: {
          select: {
            title: true,
            durationMinutes: true,
          },
        },
      },
    });

    // 9. Interview sessions
    const interviewSessions = await prisma.interviewSession.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        scorecard: true,
      },
    });

    return NextResponse.json({
      overview: {
        totalSolved,
        totalAttempted,
        totalProblems: allProblems.length,
        accuracy: totalAttempted > 0 ? Math.round((totalSolved / totalAttempted) * 100) : 0,
        streak,
      },
      difficultyCounts,
      topicMastery,
      weakTopics,
      recentSubmissions: recentSubmissions.map((s) => ({
        id: s.id,
        problemTitle: s.problem.title,
        problemSlug: s.problem.slug,
        difficulty: s.problem.difficulty,
        language: s.language,
        verdict: s.verdict,
        executionTimeMs: s.executionTimeMs,
        createdAt: s.createdAt,
      })),
      contestAttempts: contestAttempts.map((ca) => ({
        id: ca.id,
        contestTitle: ca.contest.title,
        durationMinutes: ca.contest.durationMinutes,
        score: ca.score,
        startedAt: ca.startedAt,
        submittedAt: ca.submittedAt,
        status: ca.status,
      })),
      interviewSessions: interviewSessions.map((is) => ({
        id: is.id,
        type: is.type,
        status: is.status,
        overallScore: is.scorecard?.overallScore ?? null,
        summary: is.scorecard?.transcriptSummary ?? null,
        createdAt: is.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('User dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve dashboard analytics' },
      { status: 500 }
    );
  }
}
