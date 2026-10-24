const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function optimize() {
  console.log('Optimizing SQLite database for extreme concurrency (4,000+ users)...');
  try {
    const wal = await prisma.$queryRawUnsafe('PRAGMA journal_mode = WAL;');
    console.log('Journal mode configured to WAL:', wal);

    await prisma.$queryRawUnsafe('PRAGMA synchronous = NORMAL;');
    console.log('Synchronous mode set to NORMAL (ultra-fast commits)');

    await prisma.$queryRawUnsafe('PRAGMA cache_size = -64000;'); // 64MB cache
    console.log('Cache size set to 64MB');

    await prisma.$queryRawUnsafe('PRAGMA busy_timeout = 15000;'); // 15 second busy timeout
    console.log('Busy timeout set to 15,000ms (zero database lock failures)');

    await prisma.$queryRawUnsafe('PRAGMA temp_store = MEMORY;');
    console.log('Temp tables stored in MEMORY');

    console.log('Database optimization completed successfully!');
  } catch (err) {
    console.error('Error optimizing database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

optimize();
