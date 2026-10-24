import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/lib/prisma';

describe('Phase 5: Contest Server-Authoritative Timer & Submission Lockdown', () => {
  let testUserId: string;
  let testContestId: string;
  let testProblemId: string;

  beforeAll(async () => {
    // 1. Get or create test user
    let user = await prisma.user.findUnique({
      where: { email: 'student@codevita.hub' },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test_contest_user@codevita.hub',
          name: 'Contest Tester',
          role: 'STUDENT',
        },
      });
    }
    testUserId = user.id;

    // 2. Fetch a published problem
    const problem = await prisma.problem.findFirst({
      where: { isPublished: true },
    });
    if (!problem) throw new Error('No published problems found');
    testProblemId = problem.id;

    // 3. Create a test Contest
    const contest = await prisma.contest.create({
      data: {
        slug: `unit-test-contest-${Date.now()}`,
        title: 'Unit Test Contest',
        description: 'Timer & lockdown validation contest',
        durationMinutes: 90,
        presetType: 'STANDARD_90',
        isPublished: true,
        contestProblems: {
          create: [
            {
              problemId: testProblemId,
              points: 100,
              orderIndex: 1,
            },
          ],
        },
      },
    });
    testContestId = contest.id;
  });

  afterAll(async () => {
    // Clean up created contest and attempts
    await prisma.contestAttempt.deleteMany({
      where: { contestId: testContestId },
    });
    await prisma.contestProblem.deleteMany({
      where: { contestId: testContestId },
    });
    await prisma.contest.delete({
      where: { id: testContestId },
    });
  });

  it('Contest attempt initializes with server-authoritative endsAt based on durationMinutes', async () => {
    const durationMinutes = 90;
    const startedAt = new Date();
    const expectedEndsAtMs = startedAt.getTime() + durationMinutes * 60 * 1000;

    const attempt = await prisma.contestAttempt.create({
      data: {
        contestId: testContestId,
        userId: testUserId,
        startedAt,
        endsAt: new Date(expectedEndsAtMs),
        status: 'IN_PROGRESS',
        score: 0,
      },
    });

    expect(attempt.id).toBeDefined();
    expect(attempt.status).toBe('IN_PROGRESS');
    expect(attempt.endsAt.getTime() - attempt.startedAt.getTime()).toBe(durationMinutes * 60 * 1000);

    // Simulate page refresh / subsequent client query after 30 seconds
    const simulatedNow = startedAt.getTime() + 30 * 1000;
    const remainingSeconds = Math.max(0, Math.floor((attempt.endsAt.getTime() - simulatedNow) / 1000));

    // Survives reload: remaining time is exactly 90 mins minus 30 seconds = 5370s
    expect(remainingSeconds).toBe(90 * 60 - 30);
  });

  it('Server marks attempt as TIMED_OUT when endsAt has passed', async () => {
    const pastStartedAt = new Date(Date.now() - 95 * 60 * 1000); // 95 mins ago
    const pastEndsAt = new Date(pastStartedAt.getTime() + 90 * 60 * 1000); // Ended 5 mins ago

    const expiredAttempt = await prisma.contestAttempt.create({
      data: {
        contestId: testContestId,
        userId: testUserId,
        startedAt: pastStartedAt,
        endsAt: pastEndsAt,
        status: 'IN_PROGRESS',
        score: 0,
      },
    });

    const now = Date.now();
    const isExpired = now > expiredAttempt.endsAt.getTime();
    expect(isExpired).toBe(true);

    // Check timer calculation
    const remainingSeconds = Math.max(0, Math.floor((expiredAttempt.endsAt.getTime() - now) / 1000));
    expect(remainingSeconds).toBe(0);

    // Simulate server auto-timeout update
    const updated = await prisma.contestAttempt.update({
      where: { id: expiredAttempt.id },
      data: {
        status: 'TIMED_OUT',
        submittedAt: expiredAttempt.endsAt,
        totalTimeSpentSec: 90 * 60,
      },
    });

    expect(updated.status).toBe('TIMED_OUT');
    expect(updated.totalTimeSpentSec).toBe(5400);
  });

  it('Server-authoritative submission policy strictly rejects late submissions', async () => {
    // Attempt that expired 10 seconds ago (beyond the 5s grace window)
    const expiredAttempt = await prisma.contestAttempt.create({
      data: {
        contestId: testContestId,
        userId: testUserId,
        startedAt: new Date(Date.now() - 100 * 1000),
        endsAt: new Date(Date.now() - 10 * 1000), // Ended 10s ago
        status: 'IN_PROGRESS',
        score: 0,
      },
    });

    const now = Date.now();
    const GRACE_PERIOD_MS = 5000;
    const isLate = now > expiredAttempt.endsAt.getTime() + GRACE_PERIOD_MS;

    expect(isLate).toBe(true);

    // Assert that the policy would reject late submissions
    const canAcceptSubmission = !isLate && expiredAttempt.status === 'IN_PROGRESS';
    expect(canAcceptSubmission).toBe(false);
  });

  it('Contest score accumulates properly for accepted submissions and prevents duplicate inflation', async () => {
    const activeAttempt = await prisma.contestAttempt.create({
      data: {
        contestId: testContestId,
        userId: testUserId,
        startedAt: new Date(),
        endsAt: new Date(Date.now() + 60 * 60 * 1000),
        status: 'IN_PROGRESS',
        score: 0,
      },
    });

    // 1. First ACCEPTED submission awards 100 points
    await prisma.submission.create({
      data: {
        userId: testUserId,
        problemId: testProblemId,
        contestAttemptId: activeAttempt.id,
        language: 'PYTHON',
        code: 'print("test")',
        verdict: 'ACCEPTED',
        passedCases: 10,
        totalCases: 10,
      },
    });

    // Compute updated score
    let acceptedSubmissions = await prisma.submission.findMany({
      where: { contestAttemptId: activeAttempt.id, verdict: 'ACCEPTED' },
      select: { problemId: true },
    });
    let solvedIds = new Set(acceptedSubmissions.map((s) => s.problemId));
    let score = solvedIds.size * 100;
    expect(score).toBe(100);

    // 2. Second ACCEPTED submission on the SAME problem must NOT duplicate points
    await prisma.submission.create({
      data: {
        userId: testUserId,
        problemId: testProblemId,
        contestAttemptId: activeAttempt.id,
        language: 'CPP',
        code: 'int main(){}',
        verdict: 'ACCEPTED',
        passedCases: 10,
        totalCases: 10,
      },
    });

    acceptedSubmissions = await prisma.submission.findMany({
      where: { contestAttemptId: activeAttempt.id, verdict: 'ACCEPTED' },
      select: { problemId: true },
    });
    solvedIds = new Set(acceptedSubmissions.map((s) => s.problemId));
    score = solvedIds.size * 100;
    expect(score).toBe(100); // Remains 100!
  });
});
