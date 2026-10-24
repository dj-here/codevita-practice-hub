import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const addTestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  isSample: z.boolean().default(false),
  explanation: z.string().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id: problemId } = params;
    const body = await req.json().catch(() => ({}));
    const parseResult = addTestCaseSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid test case data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const { input, expectedOutput, isSample, explanation } = parseResult.data;

    // Get current max order index
    const lastTc = await prisma.testCase.findFirst({
      where: { problemId },
      orderBy: { orderIndex: 'desc' },
      select: { orderIndex: true },
    });
    const nextOrder = (lastTc?.orderIndex || 0) + 1;

    const testCase = await prisma.testCase.create({
      data: {
        problemId,
        input,
        expectedOutput,
        isSample,
        explanation: explanation || null,
        orderIndex: nextOrder,
      },
    });

    return NextResponse.json({ success: true, testCase });
  } catch (error: any) {
    console.error('Add test case error:', error);
    return NextResponse.json(
      { error: 'Failed to add test case' },
      { status: 500 }
    );
  }
}
