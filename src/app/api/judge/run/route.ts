import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { executeCode } from '@/lib/judge0';
import { checkRateLimit } from '@/lib/rate-limit';
import { ProgrammingLanguage, Verdict } from '@/types';

const runSchema = z.object({
  problemSlug: z.string().optional(),
  language: z.nativeEnum(ProgrammingLanguage),
  code: z.string().min(1, 'Code cannot be empty'),
  customInput: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const identifier = session?.user?.id || req.headers.get('x-forwarded-for') || 'anonymous';

    // Rate limit check: max 1 run every 1.5 seconds, max 40 per minute
    const rateLimit = checkRateLimit(`run:${identifier}`, {
      intervalMs: 1500,
      maxPerWindow: 40,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: `Please wait ${rateLimit.retryAfterSec || 2}s before running code again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = runSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid execution request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { problemSlug, language, code, customInput } = parsed.data;

    let timeLimitMs = 1000;
    let memoryLimitKb = 262144;
    let testCasesToRun: Array<{
      id: string;
      input: string;
      expectedOutput?: string;
      isSample: boolean;
      orderIndex: number;
    }> = [];

    if (customInput !== undefined) {
      // User specified custom input
      testCasesToRun.push({
        id: 'custom-input',
        input: customInput,
        expectedOutput: undefined,
        isSample: true,
        orderIndex: 1,
      });
    } else if (problemSlug) {
      // Fetch sample cases for the problem
      const problem = await prisma.problem.findUnique({
        where: { slug: problemSlug },
        select: {
          timeLimitMs: true,
          memoryLimitKb: true,
          testCases: {
            where: { isSample: true },
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              input: true,
              expectedOutput: true,
              orderIndex: true,
            },
          },
        },
      });

      if (!problem) {
        return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
      }

      timeLimitMs = problem.timeLimitMs;
      memoryLimitKb = problem.memoryLimitKb;
      testCasesToRun = problem.testCases.map((tc) => ({
        ...tc,
        isSample: true,
      }));
    } else {
      return NextResponse.json(
        { error: 'Must provide either problemSlug or customInput' },
        { status: 400 }
      );
    }

    // Execute each testcase sequentially or concurrently (max 3 sample cases)
    const results = [];
    for (let i = 0; i < testCasesToRun.length; i++) {
      const tc = testCasesToRun[i];
      const exec = await executeCode({
        language,
        code,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        timeLimitMs,
        memoryLimitKb,
      });

      results.push({
        caseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput || null,
        stdout: exec.stdout,
        stderr: exec.stderr,
        compileOutput: exec.compileOutput,
        executionTimeMs: exec.executionTimeMs,
        verdict: exec.verdict,
      });

      // If compilation error occurs, break early since all cases will have the same error
      if (exec.verdict === Verdict.COMPILATION_ERROR) {
        break;
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Run code error:', error);
    return NextResponse.json(
      { error: error?.message || 'Code execution failed' },
      { status: 500 }
    );
  }
}
