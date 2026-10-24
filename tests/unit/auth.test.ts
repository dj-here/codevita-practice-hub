import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { prisma } from '../../src/lib/prisma';
import { Role } from '../../src/types';

describe('Phase 1 Acceptance: Authentication & Database', () => {
  const testEmail = `test.candidate.${Date.now()}@college.edu`;
  const rawPassword = 'SecurePassword123!';

  it('verifies seeded admin account exists with hashed password', async () => {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@codevita.hub' },
    });

    expect(admin).toBeDefined();
    expect(admin?.role).toBe(Role.ADMIN);
    expect(admin?.passwordHash).toBeDefined();

    const isMatch = await bcrypt.compare('Admin@CodeVita2026', admin!.passwordHash!);
    expect(isMatch).toBe(true);
  });

  it('verifies seeded student account exists and password matches', async () => {
    const student = await prisma.user.findUnique({
      where: { email: 'student@codevita.hub' },
    });

    expect(student).toBeDefined();
    expect(student?.role).toBe(Role.USER);
    expect(student?.passwordHash).toBeDefined();

    const isMatch = await bcrypt.compare('Student@2026', student!.passwordHash!);
    expect(isMatch).toBe(true);
  });

  it('creates a new candidate user with bcrypt password hashing', async () => {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(rawPassword, salt);

    const user = await prisma.user.create({
      data: {
        name: 'Test Candidate',
        email: testEmail,
        passwordHash,
        role: Role.USER,
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe(testEmail);
    expect(user.role).toBe(Role.USER);

    // Verify password verification succeeds with correct password
    const valid = await bcrypt.compare(rawPassword, user.passwordHash!);
    expect(valid).toBe(true);

    // Verify password verification fails with wrong password
    const invalid = await bcrypt.compare('WrongPassword999', user.passwordHash!);
    expect(invalid).toBe(false);
  });

  it('enforces unique email constraint in the database', async () => {
    let errorOccurred = false;
    try {
      await prisma.user.create({
        data: {
          name: 'Duplicate Candidate',
          email: testEmail,
          passwordHash: 'dummy',
          role: Role.USER,
        },
      });
    } catch (e: any) {
      errorOccurred = true;
    }
    expect(errorOccurred).toBe(true);
  });

  it('verifies topic tags and mockvita contest presets are seeded', async () => {
    const tagsCount = await prisma.tag.count();
    expect(tagsCount).toBeGreaterThanOrEqual(10);

    const contests = await prisma.contest.findMany();
    expect(contests.length).toBeGreaterThanOrEqual(2);
    expect(contests.some((c) => c.slug === 'mockvita-standard-90')).toBe(true);
    expect(contests.some((c) => c.slug === 'mockvita-prequalifier-180')).toBe(true);
  });
});
