import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateProblemSchema = z.object({
  title: z.string().min(3).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  statement: z.string().min(10).optional(),
  inputFormat: z.string().min(3).optional(),
  outputFormat: z.string().min(3).optional(),
  constraints: z.string().min(3).optional(),
  timeLimitMs: z.number().int().min(100).max(10000).optional(),
  memoryLimitKb: z.number().int().min(16384).max(1048576).optional(),
  editorial: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    const problem = await prisma.problem.findUnique({
      where: { id },
      include: {
        testCases: {
          orderBy: { orderIndex: 'asc' },
        },
        problemTags: {
          include: { tag: true },
        },
      },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error: any) {
    console.error('Admin get problem error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve problem' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const parseResult = updateProblemSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const updated = await prisma.problem.update({
      where: { id },
      data: parseResult.data,
    });

    return NextResponse.json({ success: true, problem: updated });
  } catch (error: any) {
    console.error('Admin update problem error:', error);
    return NextResponse.json(
      { error: 'Failed to update problem' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { id } = params;
    await prisma.problem.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Problem deleted' });
  } catch (error: any) {
    console.error('Admin delete problem error:', error);
    return NextResponse.json(
      { error: 'Failed to delete problem' },
      { status: 500 }
    );
  }
}
