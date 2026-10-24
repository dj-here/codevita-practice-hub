const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting CodeVita Practice Hub seeding...');

  // 1. Seed Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@codevita.hub';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@CodeVita2026';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await prisma.user.create({
      data: {
        name: process.env.ADMIN_NAME || 'System Administrator',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Seeded Admin account: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin account already exists: ${adminEmail}`);
  }

  // 2. Seed Demo Student User
  const studentEmail = process.env.STUDENT_EMAIL || 'student@codevita.hub';
  const studentPassword = process.env.STUDENT_PASSWORD || 'Student@2026';
  const existingStudent = await prisma.user.findUnique({ where: { email: studentEmail } });

  if (!existingStudent) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(studentPassword, salt);
    await prisma.user.create({
      data: {
        name: process.env.STUDENT_NAME || 'Demo Student',
        email: studentEmail,
        passwordHash,
        role: 'USER',
      },
    });
    console.log(`✅ Seeded Student account: ${studentEmail}`);
  } else {
    console.log(`ℹ️ Student account already exists: ${studentEmail}`);
  }

  // 3. Seed Topic Tags
  const tags = [
    { name: 'Number Theory & Primes', slug: 'number-theory-primes', description: 'GCD, LCM, Prime Factorization, Sieve of Eratosthenes, Modular Arithmetic' },
    { name: 'Arrays & Two Pointers', slug: 'arrays-two-pointers', description: 'Sliding Window, Prefix Sums, Two Pointers, Subarrays' },
    { name: 'Strings & Parsing', slug: 'strings-parsing', description: 'String Matching, Pattern Generation, Palindromes, Token Parsing' },
    { name: 'Matrices & Grids', slug: 'matrices-grids', description: '2D Grid Navigation, Island Traversal, Matrix Transformations' },
    { name: 'Recursion & Backtracking', slug: 'recursion-backtracking', description: 'N-Queens, Sudoku, Subset Generation, Permutations' },
    { name: 'Greedy Algorithms', slug: 'greedy-algorithms', description: 'Interval Scheduling, Fractional Knapsack, Activity Selection' },
    { name: 'Dynamic Programming', slug: 'dynamic-programming', description: '0/1 Knapsack, Longest Common Subsequence, Grid Paths, Coin Change' },
    { name: 'Graphs & Trees', slug: 'graphs-trees', description: 'BFS, DFS, Dijkstra, Minimum Spanning Trees, Topological Sort' },
    { name: 'Binary Search & Sorting', slug: 'binary-search-sorting', description: 'Search in Rotated Arrays, Custom Comparators, Median of Arrays' },
    { name: 'Simulation & Bit Manipulation', slug: 'simulation-bit-manipulation', description: 'Clockwise/Counter-Clockwise Shifts, Bitmasks, Game Simulation' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name, description: tag.description },
      create: tag,
    });
  }
  console.log(`✅ Seeded ${tags.length} CodeVita topic tags`);

  // 4. Seed Standard MockVita Contest Presets
  const presets = [
    {
      slug: 'mockvita-standard-90',
      title: 'MockVita Standard Sprint (90 min)',
      description: 'Fast-paced mock contest featuring 3 algorithmic problems: 1 Easy, 1 Medium, and 1 Hard.',
      durationMinutes: 90,
      presetType: 'STANDARD_90',
      isPublished: true,
    },
    {
      slug: 'mockvita-prequalifier-180',
      title: 'MockVita Pre-Qualifier Simulation (180 min)',
      description: 'Full-length pre-qualifier simulation featuring 6 algorithmic problems across various topics.',
      durationMinutes: 180,
      presetType: 'STANDARD_180',
      isPublished: true,
    },
  ];

  for (const preset of presets) {
    await prisma.contest.upsert({
      where: { slug: preset.slug },
      update: { title: preset.title, description: preset.description, durationMinutes: preset.durationMinutes },
      create: preset,
    });
  }
  console.log(`✅ Seeded ${presets.length} MockVita contest presets`);

  // 5. Seed All 220 Problems from /content/problems
  console.log('\n📚 Seeding All CodeVita Problems from /content/problems...');
  const { execSync } = require('child_process');
  execSync('node scripts/seed-problems.js', { stdio: 'inherit' });

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
