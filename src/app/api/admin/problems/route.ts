import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createProblemSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  statement: z.string().min(10),
  inputFormat: z.string().min(3),
  outputFormat: z.string().min(3),
  constraints: z.string().min(3),
  timeLimitMs: z.number().int().min(100).max(10000).default(1000),
  memoryLimitKb: z.number().int().min(16384).max(1048576).default(262144),
  editorial: z.string().optional(),
  isPublished: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const published = searchParams.get('published');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { slug: { contains: search.trim() } },
      ];
    }
    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }
    if (published !== null && published !== undefined && published !== '') {
      where.isPublished = published === 'true';
    }

    const [problems, totalCount] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { slug: 'asc' },
        include: {
          problemTags: {
            include: { tag: true },
          },
          _count: {
            select: {
              testCases: true,
              submissions: true,
            },
          },
        },
      }),
      prisma.problem.count({ where }),
    ]);

    return NextResponse.json({
      problems: problems.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        timeLimitMs: p.timeLimitMs,
        memoryLimitKb: p.memoryLimitKb,
        isPublished: p.isPublished,
        testCaseCount: p._count.testCases,
        submissionCount: p._count.submissions,
        tags: p.problemTags.map((pt) => pt.tag.name),
        createdAt: p.createdAt,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Admin list problems error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve problems' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json().catch(() => ({}));
    const parseResult = createProblemSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid problem data', details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Check slug collision
    const existing = await prisma.problem.findUnique({
      where: { slug: data.slug },
    });
    if (existing) {
      return NextResponse.json(
        { error: `Problem with slug "${data.slug}" already exists` },
        { status: 400 }
      );
    }

    const problem = await prisma.problem.create({
      data: {
        slug: data.slug,
        title: data.title,
        difficulty: data.difficulty,
        statement: data.statement,
        inputFormat: data.inputFormat,
        outputFormat: data.outputFormat,
        constraints: data.constraints,
        timeLimitMs: data.timeLimitMs,
        memoryLimitKb: data.memoryLimitKb,
        editorial: data.editorial || '',
        isPublished: data.isPublished,
      },
    });

    // Connect tags if provided
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const tag = await prisma.tag.findFirst({
          where: { name: tagName },
        });
        if (tag) {
          await prisma.problemTag.create({
            data: {
              problemId: problem.id,
              tagId: tag.id,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      problemId: problem.id,
      slug: problem.slug,
    });
  } catch (error: any) {
    console.error('Admin create problem error:', error);
    return NextResponse.json(
      { error: 'Failed to create problem' },
      { status: 500 }
    );
  }
}
