import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { executeCode } from '@/lib/judge0';
import { checkRateLimit } from '@/lib/rate-limit';
import { aggregateVerdicts } from '@/lib/verdicts';
import { ProgrammingLanguage, Verdict } from '@/types';

export const dynamic = 'force-dynamic';

const contestSubmitSchema = z.object({
  problemId: z.string().min(1, 'Problem ID is required'),
  language: z.enum(['c', 'cpp', 'java', 'python', 'C', 'CPP', 'JAVA', 'PYTHON']),
  code: z.string().min(1, 'Source code cannot be empty').max(65536, 'Source code exceeds 64KB limit'),
});

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

    // Rate limiting: max 1 submission every 3 seconds, max 20 per window
    const rateLimit = checkRateLimit(`contest-submit:${userId}`, {
      intervalMs: 3000,
      maxPerWindow: 20,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Submission rate limit exceeded. Please wait ${rateLimit.retryAfterSec || 3} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = contestSubmitSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { problemId, code } = parseResult.data;
    const languageStr = parseResult.data.language.toUpperCase() as keyof typeof ProgrammingLanguage;
    const language = ProgrammingLanguage[languageStr] || ProgrammingLanguage.PYTHON;

    // Fetch attempt
    const attempt = await prisma.contestAttempt.findUnique({
      where: { id: attemptId },
      include: {
        contest: {
          include: {
            contestProblems: true,
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

    // SERVER-AUTHORITATIVE DEADLINE CHECK (with 5s network grace)
    const now = Date.now();
    const GRACE_PERIOD_MS = 5000;
    if (now > attempt.endsAt.getTime() + GRACE_PERIOD_MS || attempt.status !== 'IN_PROGRESS') {
      if (attempt.status === 'IN_PROGRESS') {
        await prisma.contestAttempt.update({
          where: { id: attemptId },
          data: { status: 'TIMED_OUT', submittedAt: attempt.endsAt },
        });
      }
      return NextResponse.json(
        { error: 'Contest has ended. Submissions are no longer accepted.' },
        { status: 403 }
      );
    }

    // Check problem is part of this contest
    const contestProblem = attempt.contest.contestProblems.find(
      (cp) => cp.problemId === problemId
    );
    if (!contestProblem) {
      return NextResponse.json(
        { error: 'Problem does not belong to this contest' },
        { status: 400 }
      );
    }

    // Fetch problem test cases (including hidden cases)
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: {
        testCases: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!problem || problem.testCases.length === 0) {
      return NextResponse.json({ error: 'Problem has no test cases' }, { status: 404 });
    }

    // Execute test cases
    const caseExecutionResults: Array<{
      testCaseId: string;
      verdict: Verdict;
      executionTimeMs: number;
      memoryKb: number;
      stdout: string;
      stderr: string;
      compileOutput: string;
      isSample: boolean;
    }> = [];

    let maxTimeMs = 0;
    let maxMemoryKb = 0;
    let passedCount = 0;
    let compileErrorOutput = '';

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];
      const exec = await executeCode({
        language,
        code,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitKb: problem.memoryLimitKb,
      });

      maxTimeMs = Math.max(maxTimeMs, exec.executionTimeMs);
      maxMemoryKb = Math.max(maxMemoryKb, exec.memoryKb);

      if (exec.verdict === Verdict.ACCEPTED) {
        passedCount++;
      }

      if (exec.verdict === Verdict.COMPILATION_ERROR) {
        compileErrorOutput = exec.compileOutput || exec.stderr;
      }

      caseExecutionResults.push({
        testCaseId: tc.id,
        verdict: exec.verdict,
        executionTimeMs: exec.executionTimeMs,
        memoryKb: exec.memoryKb,
        stdout: exec.stdout,
        stderr: exec.stderr,
        compileOutput: exec.compileOutput,
        isSample: tc.isSample,
      });

      // Break on compilation error as remaining cases will also fail
      if (exec.verdict === Verdict.COMPILATION_ERROR) {
        break;
      }
    }

    const finalVerdict = aggregateVerdicts(caseExecutionResults);

    // Create Submission record linked to this ContestAttempt
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        contestAttemptId: attemptId,
        language: language.toString(),
        code,
        verdict: finalVerdict,
        executionTimeMs: maxTimeMs,
        memoryKb: maxMemoryKb,
        compileOutput: compileErrorOutput || null,
        totalCases: problem.testCases.length,
        passedCases: passedCount,
        caseResults: {
          create: caseExecutionResults.map((cr) => ({
            testCaseId: cr.testCaseId,
            verdict: cr.verdict,
            executionTimeMs: cr.executionTimeMs,
            memoryKb: cr.memoryKb,
            // Shield hidden test case stdout / stderr
            stdout: cr.isSample ? cr.stdout : null,
            stderr: cr.isSample ? cr.stderr : null,
            isSample: cr.isSample,
          })),
        },
      },
      include: {
        caseResults: {
          select: {
            id: true,
            testCaseId: true,
            verdict: true,
            executionTimeMs: true,
            memoryKb: true,
            stdout: true,
            stderr: true,
            isSample: true,
          },
        },
      },
    });

    // Update UserProgress
    await prisma.userProgress.upsert({
      where: {
        userId_problemId: { userId, problemId },
      },
      update: {
        attempted: true,
        solved: finalVerdict === Verdict.ACCEPTED ? true : undefined,
        solvedAt: finalVerdict === Verdict.ACCEPTED ? new Date() : undefined,
        lastAttemptedAt: new Date(),
        submissionCount: { increment: 1 },
      },
      create: {
        userId,
        problemId,
        attempted: true,
        solved: finalVerdict === Verdict.ACCEPTED,
        solvedAt: finalVerdict === Verdict.ACCEPTED ? new Date() : null,
        submissionCount: 1,
      },
    });

    // Recalculate Contest Score
    const acceptedSubmissions = await prisma.submission.findMany({
      where: {
        contestAttemptId: attemptId,
        verdict: 'ACCEPTED',
      },
      select: { problemId: true },
    });

    const solvedProblemIds = new Set(acceptedSubmissions.map((s) => s.problemId));
    let newScore = 0;
    attempt.contest.contestProblems.forEach((cp) => {
      if (solvedProblemIds.has(cp.problemId)) {
        newScore += cp.points;
      }
    });

    await prisma.contestAttempt.update({
      where: { id: attemptId },
      data: { score: newScore },
    });

    return NextResponse.json({
      submission: {
        id: submission.id,
        verdict: submission.verdict,
        executionTimeMs: submission.executionTimeMs,
        memoryKb: submission.memoryKb,
        passedCases: submission.passedCases,
        totalCases: submission.totalCases,
        compileOutput: submission.compileOutput,
        createdAt: submission.createdAt,
        caseResults: submission.caseResults.map((cr) => ({
          id: cr.id,
          testCaseId: cr.testCaseId,
          verdict: cr.verdict,
          executionTimeMs: cr.executionTimeMs,
          isSample: cr.isSample,
          stdout: cr.isSample ? cr.stdout : null,
          stderr: cr.isSample ? cr.stderr : null,
        })),
      },
      updatedScore: newScore,
      isSolved: finalVerdict === Verdict.ACCEPTED,
    });
  } catch (error: any) {
    console.error('Contest submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process contest submission' },
      { status: 500 }
    );
  }
}
