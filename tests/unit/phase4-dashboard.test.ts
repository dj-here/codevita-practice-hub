import { describe, it, expect } from 'vitest';
import { prisma } from '../../src/lib/prisma';

describe('Phase 4: Problem List Performance & Dashboard Analytics', () => {
  it('Problem list query must execute under 300ms with 220+ seeded problems', async () => {
    const start = Date.now();

    const [problems, totalCount] = await Promise.all([
      prisma.problem.findMany({
        where: { isPublished: true },
        skip: 0,
        take: 20,
        orderBy: { slug: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          difficulty: true,
          problemTags: {
            select: {
              tag: { select: { name: true, slug: true } },
            },
          },
        },
      }),
      prisma.problem.count({ where: { isPublished: true } }),
    ]);

    const elapsed = Date.now() - start;

    expect(totalCount).toBeGreaterThanOrEqual(220);
    expect(problems.length).toBe(20);
    expect(elapsed).toBeLessThan(300); // Strict requirement: Under 300ms
  });

  it('Problem filters work correctly for difficulty and tags', async () => {
    // 1. Difficulty filter (EASY)
    const easyProblems = await prisma.problem.findMany({
      where: {
        isPublished: true,
        difficulty: 'EASY',
      },
      take: 10,
    });
    expect(easyProblems.length).toBeGreaterThan(0);
    easyProblems.forEach((p) => {
      expect(p.difficulty).toBe('EASY');
    });

    // 2. Tag filter (e.g. 'Number Theory & Primes')
    const numberTheoryProblems = await prisma.problem.findMany({
      where: {
        isPublished: true,
        problemTags: {
          some: {
            tag: { name: 'Number Theory & Primes' },
          },
        },
      },
      include: {
        problemTags: {
          include: { tag: true },
        },
      },
    });

    expect(numberTheoryProblems.length).toBeGreaterThanOrEqual(10);
    numberTheoryProblems.forEach((p) => {
      const tagNames = p.problemTags.map((pt) => pt.tag.name);
      expect(tagNames).toContain('Number Theory & Primes');
    });
  });

  it('Problem sorting works correctly for slug ascending and descending', async () => {
    const ascProblems = await prisma.problem.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { slug: 'asc' },
      select: { slug: true },
    });

    const descProblems = await prisma.problem.findMany({
      where: { isPublished: true },
      take: 5,
      orderBy: { slug: 'desc' },
      select: { slug: true },
    });

    expect(ascProblems[0].slug.localeCompare(ascProblems[1].slug)).toBeLessThanOrEqual(0);
    expect(descProblems[0].slug.localeCompare(descProblems[1].slug)).toBeGreaterThanOrEqual(0);
  });

  it('Dashboard topic mastery covers all 10 major algorithmic topics with > 0 problems', async () => {
    const allTags = await prisma.tag.findMany({
      include: {
        problemTags: true,
      },
    });

    const expectedTopics = [
      'Number Theory & Primes',
      'Arrays & Two Pointers',
      'Strings & Parsing',
      'Matrices & Grids',
      'Recursion & Backtracking',
      'Greedy Algorithms',
      'Dynamic Programming',
      'Graphs & Trees',
      'Binary Search & Sorting',
      'Simulation & Bit Manipulation',
    ];

    expectedTopics.forEach((expected) => {
      const tag = allTags.find((t) => t.name === expected);
      expect(tag).toBeDefined();
      expect(tag!.problemTags.length).toBeGreaterThanOrEqual(10);
    });
  });

  it('Dashboard difficulty breakdown satisfies ~35% Easy, ~45% Medium, ~20% Hard ratio', async () => {
    const [easyCount, mediumCount, hardCount, totalCount] = await Promise.all([
      prisma.problem.count({ where: { isPublished: true, difficulty: 'EASY' } }),
      prisma.problem.count({ where: { isPublished: true, difficulty: 'MEDIUM' } }),
      prisma.problem.count({ where: { isPublished: true, difficulty: 'HARD' } }),
      prisma.problem.count({ where: { isPublished: true } }),
    ]);

    expect(totalCount).toBeGreaterThanOrEqual(220);

    const easyPct = (easyCount / totalCount) * 100;
    const mediumPct = (mediumCount / totalCount) * 100;
    const hardPct = (hardCount / totalCount) * 100;

    // Easy ~35% (30% - 40%)
    expect(easyPct).toBeGreaterThanOrEqual(30);
    expect(easyPct).toBeLessThanOrEqual(40);

    // Medium ~45% (40% - 50%)
    expect(mediumPct).toBeGreaterThanOrEqual(40);
    expect(mediumPct).toBeLessThanOrEqual(50);

    // Hard ~20% (15% - 25%)
    expect(hardPct).toBeGreaterThanOrEqual(15);
    expect(hardPct).toBeLessThanOrEqual(25);
  });
});
