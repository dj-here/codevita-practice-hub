import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const difficulty = searchParams.get('difficulty') || '';
    const tag = searchParams.get('tag') || '';
    const status = searchParams.get('status') || ''; // 'solved', 'attempted', 'unsolved'
    const sort = searchParams.get('sort') || 'id-asc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const skip = (page - 1) * limit;

    let orderBy: any = { slug: 'asc' };
    if (sort === 'id-desc') {
      orderBy = { slug: 'desc' };
    } else if (sort === 'title-asc') {
      orderBy = { title: 'asc' };
    } else if (sort === 'title-desc') {
      orderBy = { title: 'desc' };
    } else if (sort === 'difficulty-asc') {
      orderBy = { difficulty: 'asc' };
    } else if (sort === 'difficulty-desc') {
      orderBy = { difficulty: 'desc' };
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    // Build Prisma query filters
    const where: any = {
      isPublished: true,
    };

    if (search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { statement: { contains: search.trim() } },
      ];
    }

    if (difficulty) {
      where.difficulty = difficulty.toUpperCase();
    }

    if (tag) {
      where.problemTags = {
        some: {
          tag: {
            name: { equals: tag },
          },
        },
      };
    }

    // Filter by solved / attempted / unsolved status if requested and logged in
    if (userId && status) {
      if (status === 'solved') {
        where.userProgress = {
          some: {
            userId,
            solved: true,
          },
        };
      } else if (status === 'attempted') {
        where.userProgress = {
          some: {
            userId,
            attempted: true,
            solved: false,
          },
        };
      } else if (status === 'unsolved') {
        where.userProgress = {
          none: {
            userId,
            solved: true,
          },
        };
      }
    }

    const [problems, totalCount] = await Promise.all([
      prisma.problem.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          timeLimitMs: true,
          memoryLimitKb: true,
          problemTags: {
            select: {
              tag: {
                select: { name: true, slug: true },
              },
            },
          },
          userProgress: userId
            ? {
                where: { userId },
                select: { solved: true, attempted: true },
              }
            : false,
        },
      }),
      prisma.problem.count({ where }),
    ]);

    const formattedProblems = problems.map((p) => {
      const progress = p.userProgress && (p.userProgress as any)[0];
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        timeLimitMs: p.timeLimitMs,
        memoryLimitKb: p.memoryLimitKb,
        tags: p.problemTags.map((pt) => pt.tag.name),
        solved: !!progress?.solved,
        attempted: !!progress?.attempted,
      };
    });

    return NextResponse.json({
      problems: formattedProblems,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Fetch problems list error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve problems' },
      { status: 500 }
    );
  }
}
