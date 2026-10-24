import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { processInterviewTurn } from '@/lib/interview/anthropic-engine';
import { checkRateLimit } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content cannot be empty').max(10000, 'Response is too long'),
});

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;
    const { sessionId } = params;

    // Rate limit: max 1 message every 2 seconds, max 30 per minute
    const rateLimit = checkRateLimit(`interview-msg:${userId}`, {
      intervalMs: 2000,
      maxPerWindow: 30,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Please pause briefly before submitting your next answer.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = sendMessageSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid message', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { content } = parseResult.data;

    const interviewSession = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!interviewSession) {
      return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
    }

    if (interviewSession.userId !== userId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (interviewSession.status !== 'IN_PROGRESS') {
      return NextResponse.json(
        { error: 'This interview session has already concluded.' },
        { status: 400 }
      );
    }

    const currentOrderIndex = interviewSession.messages.length;

    // 1. Save candidate message
    const userMessage = await prisma.interviewMessage.create({
      data: {
        sessionId,
        role: 'USER',
        content,
        orderIndex: currentOrderIndex + 1,
      },
    });

    // 2. Prepare conversation history for turn processing
    const history = interviewSession.messages
      .map((m) => ({ role: m.role, content: m.content }))
      .concat([{ role: 'USER', content }]);

    // 3. Process turn with Anthropic Claude 3.5 Sonnet or static fallback engine
    const nextAction = await processInterviewTurn(
      interviewSession.type as 'TECHNICAL' | 'MANAGERIAL_HR',
      history,
      interviewSession.language
    );

    // 4. Save assistant response
    const assistantMessage = await prisma.interviewMessage.create({
      data: {
        sessionId,
        role: 'ASSISTANT',
        content: nextAction.reply,
        orderIndex: currentOrderIndex + 2,
      },
    });

    // 5. If interview is completed, save the scorecard
    let createdScorecard = null;
    if (nextAction.isComplete && nextAction.scorecard) {
      const sc = nextAction.scorecard;
      createdScorecard = await prisma.interviewScorecard.create({
        data: {
          sessionId,
          overallScore: sc.overallScore,
          communicationScore: sc.communicationScore,
          correctnessScore: sc.correctnessScore,
          problemSolvingScore: sc.problemSolvingScore,
          confidenceScore: sc.confidenceScore,
          strengths: JSON.stringify(sc.strengths),
          gaps: JSON.stringify(sc.gaps),
          sevenDayPlan: JSON.stringify(sc.sevenDayPlan),
          transcriptSummary: sc.transcriptSummary,
          isStaticFallback: sc.isStaticFallback,
        },
      });

      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      reply: nextAction.reply,
      isComplete: nextAction.isComplete,
      scorecard: createdScorecard ? {
        overallScore: createdScorecard.overallScore,
        communicationScore: createdScorecard.communicationScore,
        correctnessScore: createdScorecard.correctnessScore,
        problemSolvingScore: createdScorecard.problemSolvingScore,
        confidenceScore: createdScorecard.confidenceScore,
        strengths: nextAction.scorecard?.strengths || [],
        gaps: nextAction.scorecard?.gaps || [],
        sevenDayPlan: nextAction.scorecard?.sevenDayPlan || [],
        transcriptSummary: createdScorecard.transcriptSummary,
        isStaticFallback: createdScorecard.isStaticFallback,
      } : undefined,
      isStaticFallback: nextAction.isStaticFallback,
    });
  } catch (error: any) {
    console.error('Send interview message error:', error);
    return NextResponse.json(
      { error: 'Failed to process interview response' },
      { status: 500 }
    );
  }
}
