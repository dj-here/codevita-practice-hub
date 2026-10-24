import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.submission.findUnique({
      where: { id: params.id },
      include: {
        problem: {
          select: {
            title: true,
            slug: true,
            difficulty: true,
          },
        },
        caseResults: {
          where: { isSample: true },
          select: {
            id: true,
            verdict: true,
            executionTimeMs: true,
            memoryKb: true,
            stdout: true,
            stderr: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Only allow author or admin to view submission
    if (submission.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ submission });
  } catch (error: any) {
    console.error('Fetch submission error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve submission' },
      { status: 500 }
    );
  }
}
