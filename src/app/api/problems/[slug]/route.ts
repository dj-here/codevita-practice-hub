import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// High-speed in-memory cache for static problem content (handles thousands of requests/sec with 0 DB load)
const problemMetadataCache = new Map<string, any>();

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    let cached = problemMetadataCache.get(slug);

    if (!cached) {
      const problem = await prisma.problem.findUnique({
        where: { slug },
        include: {
          problemTags: {
            include: {
              tag: true,
            },
          },
          // STRICT SECURITY: Fetch ONLY sample test cases. Hidden test cases must never be exposed.
          testCases: {
            where: { isSample: true },
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              input: true,
              expectedOutput: true,
              explanation: true,
              orderIndex: true,
            },
          },
        },
      });

      if (!problem || !problem.isPublished) {
        return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
      }

      cached = {
        id: problem.id,
        slug: problem.slug,
        title: problem.title,
        statement: problem.statement,
        inputFormat: problem.inputFormat,
        outputFormat: problem.outputFormat,
        constraints: problem.constraints,
        difficulty: problem.difficulty,
        timeLimitMs: problem.timeLimitMs,
        memoryLimitKb: problem.memoryLimitKb,
        tags: problem.problemTags.map((pt) => pt.tag.name),
        sampleCases: problem.testCases,
      };

      problemMetadataCache.set(slug, cached);
    }

    // Check user progress if logged in
    let solved = false;
    let attempted = false;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_problemId: {
            userId: session.user.id,
            problemId: cached.id,
          },
        },
      });
      if (progress) {
        solved = progress.solved;
        attempted = progress.attempted;
      }
    }

    return NextResponse.json({
      problem: {
        ...cached,
        solved,
        attempted,
      },
    });
  } catch (error: any) {
    console.error('Error fetching problem:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve problem details' },
      { status: 500 }
    );
  }
}
