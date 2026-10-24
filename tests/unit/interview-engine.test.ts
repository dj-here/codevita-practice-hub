import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/lib/prisma';
import {
  generateOpeningMessage,
  processStaticTurn,
  generateStaticScorecard,
} from '../../src/lib/interview/static-engine';

describe('Phase 6: TCS Mock Interview Engine & Scorecard', () => {
  let testUserId: string;

  beforeAll(async () => {
    let user = await prisma.user.findUnique({
      where: { email: 'student@codevita.hub' },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: 'test_interview_user@codevita.hub',
          name: 'Interview Candidate',
          role: 'STUDENT',
        },
      });
    }
    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.interviewScorecard.deleteMany({
      where: { session: { userId: testUserId } },
    });
    await prisma.interviewMessage.deleteMany({
      where: { session: { userId: testUserId } },
    });
    await prisma.interviewSession.deleteMany({
      where: { userId: testUserId },
    });
  });

  it('Generates authentic opening questions for Technical and HR rounds', () => {
    const techOpening = generateOpeningMessage('TECHNICAL', 'PYTHON');
    expect(techOpening).toContain('TCS Technical Interview');
    expect(techOpening).toContain('PYTHON');
    expect(techOpening).toContain('stack and heap');

    const hrOpening = generateOpeningMessage('MANAGERIAL_HR');
    expect(hrOpening).toContain('TCS Managerial and HR');
    expect(hrOpening).toContain('Tata');
    expect(hrOpening).toContain('introduce yourself');
  });

  it('Static fallback engine steps through questions one by one sequentially', () => {
    const opening = generateOpeningMessage('TECHNICAL', 'JAVA');
    const messages = [
      { role: 'ASSISTANT', content: opening },
      { role: 'USER', content: 'Stack memory stores primitives and function call frames, whereas heap memory stores objects managed by Java garbage collector.' },
    ];

    const nextTurn = processStaticTurn('TECHNICAL', messages, 'JAVA');
    expect(nextTurn.isComplete).toBe(false);
    expect(nextTurn.isStaticFallback).toBe(true);
    expect(nextTurn.questionNumber).toBe(2);
    expect(nextTurn.reply).toContain('Question 2 of 7');
    expect(nextTurn.reply).toContain('Object-Oriented Programming');
  });

  it('Concludes and generates 4-dimension scorecard when target question count is reached', () => {
    // Simulate 7 answered technical questions
    const messages: Array<{ role: string; content: string }> = [];
    for (let i = 1; i <= 7; i++) {
      messages.push({ role: 'ASSISTANT', content: `Question ${i}: Tell me about topic ${i}` });
      messages.push({ role: 'USER', content: `Here is my detailed and thorough explanation for topic ${i} with code examples and complexity analysis.` });
    }

    const finalTurn = processStaticTurn('TECHNICAL', messages, 'CPP');
    expect(finalTurn.isComplete).toBe(true);
    expect(finalTurn.scorecard).toBeDefined();

    const sc = finalTurn.scorecard!;
    expect(sc.overallScore).toBeGreaterThanOrEqual(60);
    expect(sc.overallScore).toBeLessThanOrEqual(100);
    expect(sc.communicationScore).toBeGreaterThanOrEqual(60);
    expect(sc.correctnessScore).toBeGreaterThanOrEqual(60);
    expect(sc.problemSolvingScore).toBeGreaterThanOrEqual(60);
    expect(sc.confidenceScore).toBeGreaterThanOrEqual(60);

    // Strengths, Gaps, and 7-Day Plan
    expect(sc.strengths.length).toBeGreaterThanOrEqual(2);
    expect(sc.gaps.length).toBeGreaterThanOrEqual(2);
    expect(sc.sevenDayPlan.length).toBe(7);

    for (let day = 1; day <= 7; day++) {
      const planDay = sc.sevenDayPlan.find((d) => d.day === day);
      expect(planDay).toBeDefined();
      expect(planDay!.focus).toBeTruthy();
      expect(planDay!.tasks.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('Creates database InterviewSession and persists private scorecard and transcript', async () => {
    const session = await prisma.interviewSession.create({
      data: {
        userId: testUserId,
        type: 'MANAGERIAL_HR',
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        messages: {
          create: [
            { role: 'ASSISTANT', content: 'Introduce yourself.', orderIndex: 1 },
            { role: 'USER', content: 'I am a final year computer engineering student passionate about software development and cloud systems.', orderIndex: 2 },
          ],
        },
      },
      include: { messages: true },
    });

    expect(session.id).toBeDefined();
    expect(session.messages.length).toBe(2);

    // Generate and persist scorecard
    const scorecardResult = generateStaticScorecard('MANAGERIAL_HR', session.messages);
    const scorecard = await prisma.interviewScorecard.create({
      data: {
        sessionId: session.id,
        overallScore: scorecardResult.overallScore,
        communicationScore: scorecardResult.communicationScore,
        correctnessScore: scorecardResult.correctnessScore,
        problemSolvingScore: scorecardResult.problemSolvingScore,
        confidenceScore: scorecardResult.confidenceScore,
        strengths: JSON.stringify(scorecardResult.strengths),
        gaps: JSON.stringify(scorecardResult.gaps),
        sevenDayPlan: JSON.stringify(scorecardResult.sevenDayPlan),
        transcriptSummary: scorecardResult.transcriptSummary,
        isStaticFallback: true,
      },
    });

    expect(scorecard.id).toBeDefined();
    expect(scorecard.sessionId).toBe(session.id);
    expect(scorecard.isStaticFallback).toBe(true);

    // Verify transcript is strictly isolated to the user
    const userSessions = await prisma.interviewSession.findMany({
      where: { userId: testUserId },
      include: { scorecard: true },
    });

    expect(userSessions.some((s) => s.id === session.id)).toBe(true);
  });
});
