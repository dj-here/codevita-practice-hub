import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import { generateOpeningMessage } from '@/lib/interview/static-engine';

export const dynamic = 'force-dynamic';

const startInterviewSchema = z.object({
  type: z.enum(['TECHNICAL', 'MANAGERIAL_HR']),
  language: z.enum(['C', 'CPP', 'JAVA', 'PYTHON', 'c', 'cpp', 'java', 'python']).optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json().catch(() => ({}));
    const parseResult = startInterviewSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid interview parameters', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { type } = parseResult.data;
    const language = parseResult.data.language
      ? parseResult.data.language.toUpperCase()
      : type === 'TECHNICAL'
      ? 'PYTHON'
      : null;

    // Determine if Anthropic API key is active
    const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.startsWith('sk-ant-xxx');

    // Generate initial greeting and Question 1
    const openingGreeting = generateOpeningMessage(type, language);

    // Create session and seed message 1
    const interviewSession = await prisma.interviewSession.create({
      data: {
        userId,
        type,
        language,
        status: 'IN_PROGRESS',
        startedAt: new Date(),
        messages: {
          create: {
            role: 'ASSISTANT',
            content: openingGreeting,
            orderIndex: 1,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({
      sessionId: interviewSession.id,
      type: interviewSession.type,
      language: interviewSession.language,
      startedAt: interviewSession.startedAt,
      initialMessage: openingGreeting,
      isStaticFallback: !hasAnthropicKey,
    });
  } catch (error: any) {
    console.error('Start interview error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate mock interview session' },
      { status: 500 }
    );
  }
}
