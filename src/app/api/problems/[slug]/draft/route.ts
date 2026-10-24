import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProgrammingLanguage } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ draft: null });
    }

    const { searchParams } = new URL(req.url);
    const language = (searchParams.get('language') as ProgrammingLanguage) || ProgrammingLanguage.PYTHON;

    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const draft = await prisma.codeDraft.findUnique({
      where: {
        userId_problemId_language: {
          userId: session.user.id,
          problemId: problem.id,
          language,
        },
      },
    });

    return NextResponse.json({ draft: draft?.code || null });
  } catch (error: any) {
    console.error('Fetch draft error:', error);
    return NextResponse.json({ error: 'Failed to fetch draft' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const { language, code } = body;

    if (!language || code === undefined) {
      return NextResponse.json({ error: 'Language and code are required' }, { status: 400 });
    }

    const problem = await prisma.problem.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    const draft = await prisma.codeDraft.upsert({
      where: {
        userId_problemId_language: {
          userId: session.user.id,
          problemId: problem.id,
          language,
        },
      },
      update: { code },
      create: {
        userId: session.user.id,
        problemId: problem.id,
        language,
        code,
      },
    });

    return NextResponse.json({ success: true, updatedAt: draft.updatedAt });
  } catch (error: any) {
    console.error('Save draft error:', error);
    return NextResponse.json({ error: 'Failed to save code draft' }, { status: 500 });
  }
}
