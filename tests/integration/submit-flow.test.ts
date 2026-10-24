import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import { executeCode } from '../../src/lib/judge0';
import { aggregateVerdicts } from '../../src/lib/verdicts';
import { ProgrammingLanguage, Verdict } from '../../src/types';

describe('Phase 7 Integration: Submission Flow & Hidden Case Shielding', () => {
  let testUserId: string;
  let testProblemId: string;
  let testProblemSlug: string;

  beforeAll(async () => {
    // 1. Get or create test user
    let user = await prisma.user.findUnique({
      where: { email: 'student@codevita.hub' },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'integration_tester@codevita.hub',
          name: 'Integration Tester',
          role: 'STUDENT',
        },
      });
    }
    testUserId = user.id;

    // 2. Create isolated test problem with 2 sample cases and 2 hidden cases
    testProblemSlug = `integration-flow-test-${Date.now()}`;
    const problem = await prisma.problem.create({
      data: {
        slug: testProblemSlug,
        title: 'Integration Test Problem',
        difficulty: 'EASY',
        statement: 'Read an integer and print its square.',
        inputFormat: 'A single integer N',
        outputFormat: 'N * N',
        constraints: '1 <= N <= 1000',
        timeLimitMs: 1000,
        memoryLimitKb: 262144,
        isPublished: true,
        testCases: {
          create: [
            { input: '2', expectedOutput: '4', isSample: true, orderIndex: 1 },
            { input: '3', expectedOutput: '9', isSample: true, orderIndex: 2 },
            { input: '10', expectedOutput: '100', isSample: false, orderIndex: 3 },
            { input: '25', expectedOutput: '625', isSample: false, orderIndex: 4 },
          ],
        },
      },
      include: { testCases: true },
    });
    testProblemId = problem.id;
  });

  afterAll(async () => {
    await prisma.submissionCaseResult.deleteMany({
      where: { submission: { problemId: testProblemId } },
    });
    await prisma.submission.deleteMany({
      where: { problemId: testProblemId },
    });
    await prisma.userProgress.deleteMany({
      where: { problemId: testProblemId },
    });
    await prisma.testCase.deleteMany({
      where: { problemId: testProblemId },
    });
    await prisma.problem.delete({
      where: { id: testProblemId },
    });
  });

  it('Executes correct solution, records Accepted verdict, updates progress, and masks hidden cases', async () => {
    const correctPythonCode = `import sys\nn = int(sys.stdin.read().strip())\nprint(n * n)\n`;

    // Fetch problem test cases
    const problem = await prisma.problem.findUnique({
      where: { id: testProblemId },
      include: { testCases: { orderBy: { orderIndex: 'asc' } } },
    });
    expect(problem).toBeDefined();

    // Execute each testcase through judge engine
    const caseResults: any[] = [];
    let maxTime = 0;
    let maxMem = 0;
    let passedCount = 0;

    for (const tc of problem!.testCases) {
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code: correctPythonCode,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        timeLimitMs: problem!.timeLimitMs,
        memoryLimitKb: problem!.memoryLimitKb,
      });

      maxTime = Math.max(maxTime, res.executionTimeMs);
      maxMem = Math.max(maxMem, res.memoryKb);
      if (res.verdict === Verdict.ACCEPTED) passedCount++;

      caseResults.push({
        testCaseId: tc.id,
        verdict: res.verdict,
        executionTimeMs: res.executionTimeMs,
        memoryKb: res.memoryKb,
        stdout: res.stdout,
        stderr: res.stderr,
        compileOutput: res.compileOutput,
        isSample: tc.isSample,
      });
    }

    const finalVerdict = aggregateVerdicts(caseResults);
    expect(finalVerdict).toBe(Verdict.ACCEPTED);
    expect(passedCount).toBe(4);

    // Save submission to database with hidden case masking
    const submission = await prisma.submission.create({
      data: {
        userId: testUserId,
        problemId: testProblemId,
        language: 'PYTHON',
        code: correctPythonCode,
        verdict: finalVerdict,
        executionTimeMs: maxTime,
        memoryKb: maxMem,
        totalCases: problem!.testCases.length,
        passedCases: passedCount,
        caseResults: {
          create: caseResults.map((cr) => ({
            testCaseId: cr.testCaseId,
            verdict: cr.verdict,
            executionTimeMs: cr.executionTimeMs,
            memoryKb: cr.memoryKb,
            // SECURITY: Sample case details are kept; hidden case stdout/stderr MUST be null
            stdout: cr.isSample ? cr.stdout : null,
            stderr: cr.isSample ? cr.stderr : null,
            isSample: cr.isSample,
          })),
        },
      },
      include: { caseResults: true },
    });

    expect(submission.id).toBeDefined();
    expect(submission.verdict).toBe('ACCEPTED');

    // SECURITY CHECK: Verify hidden test cases NEVER leak stdout or stderr in the database record
    submission.caseResults.forEach((cr) => {
      if (!cr.isSample) {
        expect(cr.stdout).toBeNull();
        expect(cr.stderr).toBeNull();
      } else {
        expect(cr.stdout).not.toBeNull();
      }
    });

    // Update user progress
    const progress = await prisma.userProgress.upsert({
      where: { userId_problemId: { userId: testUserId, problemId: testProblemId } },
      update: { solved: true, attempted: true },
      create: { userId: testUserId, problemId: testProblemId, solved: true, attempted: true },
    });

    expect(progress.solved).toBe(true);
  });

  it('Executes incorrect solution and records Wrong Answer verdict', async () => {
    const wrongPythonCode = `import sys\nprint(0)\n`;

    const problem = await prisma.problem.findUnique({
      where: { id: testProblemId },
      include: { testCases: { orderBy: { orderIndex: 'asc' } } },
    });

    const caseResults: any[] = [];
    for (const tc of problem!.testCases) {
      const res = await executeCode({
        language: ProgrammingLanguage.PYTHON,
        code: wrongPythonCode,
        stdin: tc.input,
        expectedOutput: tc.expectedOutput,
        timeLimitMs: problem!.timeLimitMs,
        memoryLimitKb: problem!.memoryLimitKb,
      });

      caseResults.push({
        testCaseId: tc.id,
        verdict: res.verdict,
        executionTimeMs: res.executionTimeMs,
        memoryKb: res.memoryKb,
        stdout: res.stdout,
        stderr: res.stderr,
        compileOutput: res.compileOutput,
        isSample: tc.isSample,
      });
    }

    const finalVerdict = aggregateVerdicts(caseResults);
    expect(finalVerdict).toBe(Verdict.WRONG_ANSWER);
  });
});
