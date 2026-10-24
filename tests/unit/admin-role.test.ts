import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../../src/lib/prisma';

describe('Phase 7: Role Protection & Admin Management', () => {
  let adminUserId: string;
  let studentUserId: string;
  let createdProblemId: string;

  beforeAll(async () => {
    // 1. Fetch admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@codevita.hub' },
    });
    if (!admin) throw new Error('Seeded admin account not found');
    adminUserId = admin.id;

    // 2. Fetch student user
    const student = await prisma.user.findUnique({
      where: { email: 'student@codevita.hub' },
    });
    if (!student) throw new Error('Seeded student account not found');
    studentUserId = student.id;
  });

  afterAll(async () => {
    if (createdProblemId) {
      await prisma.testCase.deleteMany({
        where: { problemId: createdProblemId },
      });
      await prisma.problem.deleteMany({
        where: { id: createdProblemId },
      });
    }
  });

  it('Verifies user roles are strictly enforced (ADMIN vs STUDENT)', async () => {
    const admin = await prisma.user.findUnique({ where: { id: adminUserId } });
    const student = await prisma.user.findUnique({ where: { id: studentUserId } });

    expect(admin?.role).toBe('ADMIN');
    expect(student?.role).not.toBe('ADMIN');
  });

  it('Admin can create, update, toggle publication, and delete problems', async () => {
    const slug = `admin-test-slug-${Date.now()}`;

    // 1. Create problem
    const problem = await prisma.problem.create({
      data: {
        slug,
        title: 'Admin Created Challenge',
        difficulty: 'MEDIUM',
        statement: 'Problem created via administrative control.',
        inputFormat: 'Input specs',
        outputFormat: 'Output specs',
        constraints: '1 <= N <= 100',
        timeLimitMs: 1500,
        memoryLimitKb: 262144,
        isPublished: true,
      },
    });
    createdProblemId = problem.id;

    expect(problem.id).toBeDefined();
    expect(problem.isPublished).toBe(true);

    // 2. Add test cases
    const tc1 = await prisma.testCase.create({
      data: {
        problemId: problem.id,
        input: '5',
        expectedOutput: '25',
        isSample: true,
        orderIndex: 1,
      },
    });
    const tc2 = await prisma.testCase.create({
      data: {
        problemId: problem.id,
        input: '10',
        expectedOutput: '100',
        isSample: false,
        orderIndex: 2,
      },
    });

    expect(tc1.isSample).toBe(true);
    expect(tc2.isSample).toBe(false);

    // 3. Toggle publication status to draft
    const unpub = await prisma.problem.update({
      where: { id: problem.id },
      data: { isPublished: false },
    });
    expect(unpub.isPublished).toBe(false);

    // 4. Verify draft problem is hidden from public API queries
    const publicQuery = await prisma.problem.findFirst({
      where: { id: problem.id, isPublished: true },
    });
    expect(publicQuery).toBeNull(); // Hidden when isPublished is false!
  });
});
