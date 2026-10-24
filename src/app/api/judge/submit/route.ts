import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { executeCode } from '@/lib/judge0';
import { checkRateLimit } from '@/lib/rate-limit';
import { aggregateVerdicts } from '@/lib/verdicts';
import { ProgrammingLanguage, Verdict } from '@/types';

const submitSchema = z.object({
  problemSlug: z.string().min(1, 'Problem slug is required'),
  language: z.nativeEnum(ProgrammingLanguage),
  code: z.string().min(1, 'Code cannot be empty'),
  contestAttemptId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit solutions' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Rate limit submissions: max 1 submission every 3 seconds, max 20 per minute
    const rateLimit = checkRateLimit(`submit:${userId}`, {
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

    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid submission data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { problemSlug, language, code, contestAttemptId } = parsed.data;

    // Fetch problem and all test cases
    const problem = await prisma.problem.findUnique({
      where: { slug: problemSlug },
      include: {
        testCases: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    if (problem.testCases.length === 0) {
      return NextResponse.json(
        { error: 'Problem has no test cases configured' },
        { status: 500 }
      );
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

    // Determine aggregate verdict
    const finalVerdict = aggregateVerdicts(caseExecutionResults);

    // Save submission to database
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId: problem.id,
        contestAttemptId: contestAttemptId || null,
        language,
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
            stdout: cr.isSample ? cr.stdout : null, // Omit hidden test case stdout from DB results
            stderr: cr.isSample ? cr.stderr : null,
            isSample: cr.isSample,
          })),
        },
      },
    });

    // Update UserProgress
    const isAccepted = finalVerdict === Verdict.ACCEPTED;
    await prisma.userProgress.upsert({
      where: {
        userId_problemId: {
          userId,
          problemId: problem.id,
        },
      },
      update: {
        attempted: true,
        solved: isAccepted ? true : undefined,
        solvedAt: isAccepted ? new Date() : undefined,
        lastAttemptedAt: new Date(),
        submissionCount: { increment: 1 },
      },
      create: {
        userId,
        problemId: problem.id,
        attempted: true,
        solved: isAccepted,
        solvedAt: isAccepted ? new Date() : null,
        lastAttemptedAt: new Date(),
        submissionCount: 1,
      },
    });

    // Return response: show per-case result for samples only; strictly hide hidden-case details
    const sampleResults = caseExecutionResults
      .filter((cr) => cr.isSample)
      .map((cr, idx) => ({
        sampleIndex: idx + 1,
        verdict: cr.verdict,
        executionTimeMs: cr.executionTimeMs,
        stdout: cr.stdout,
        stderr: cr.stderr,
      }));

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
      verdict: finalVerdict,
      executionTimeMs: maxTimeMs,
      memoryKb: maxMemoryKb,
      totalCases: problem.testCases.length,
      passedCases: passedCount,
      compileOutput: compileErrorOutput || null,
      sampleResults,
    });
  } catch (error: any) {
    console.error('Submission error:', error);
    return NextResponse.json(
      { error: error?.message || 'Submission processing failed' },
      { status: 500 }
    );
  }
}
