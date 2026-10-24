#!/usr/bin/env node
/**
 * Cross-Platform Database Restore Utility for CodeVita Practice Hub
 * Usage: node scripts/restore-db.js <backup_archive.sql.gz> [--yes]
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const crypto = require('crypto');
const { execSync } = require('child_process');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eqIdx = line.indexOf('=');
      if (eqIdx > 0) {
        const key = line.slice(0, eqIdx).trim();
        let val = line.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function runRestore() {
  loadEnv();

  const backupArg = process.argv[2];
  const forceFlag = process.argv.includes('--yes') || process.argv.includes('-y');

  if (!backupArg) {
    console.error('Usage: node scripts/restore-db.js <path_to_backup.sql.gz> [--yes]');
    process.exit(1);
  }

  const backupFilePath = path.resolve(backupArg);
  if (!fs.existsSync(backupFilePath)) {
    console.error(`Error: Backup file not found at ${backupFilePath}`);
    process.exit(1);
  }

  console.log('==================================================');
  console.log(' CodeVita Practice Hub - Cross-Platform DB Restore');
  console.log(` Source Archive: ${backupFilePath}`);
  console.log('==================================================');

  // Verify SHA256 if checksum file exists
  const checksumFile = `${backupFilePath}.sha256`;
  if (fs.existsSync(checksumFile)) {
    const expected = fs.readFileSync(checksumFile, 'utf8').split(/\s+/)[0].trim();
    const actual = crypto.createHash('sha256').update(fs.readFileSync(backupFilePath)).digest('hex');
    if (expected.toLowerCase() !== actual.toLowerCase()) {
      console.error(`Integrity Error: SHA256 checksum mismatch!`);
      console.error(`Expected: ${expected}`);
      console.error(`Actual:   ${actual}`);
      process.exit(1);
    }
    console.log('SHA256 checksum verified successfully.');
  }

  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

  if (databaseUrl.startsWith('file:') || databaseUrl.includes('dev.db')) {
    let sqlitePath = databaseUrl.replace(/^file:/, '').trim();
    if (!fs.existsSync(sqlitePath)) {
      const prismaCandidate = path.join(process.cwd(), 'prisma', path.basename(sqlitePath));
      if (fs.existsSync(prismaCandidate)) {
        sqlitePath = prismaCandidate;
      }
    }

    console.log(`Decompressing archive to SQLite database at ${sqlitePath}...`);
    const compressed = fs.readFileSync(backupFilePath);
    const decompressed = zlib.gunzipSync(compressed);
    fs.writeFileSync(sqlitePath, decompressed);
    console.log(`SQLite database successfully restored.`);
  } else {
    console.log(`Restoring PostgreSQL database from gzip archive...`);
    const compressed = fs.readFileSync(backupFilePath);
    const decompressed = zlib.gunzipSync(compressed);
    try {
      execSync(`psql "${databaseUrl}"`, {
        input: decompressed,
        stdio: ['pipe', 'inherit', 'inherit'],
      });
      console.log(`PostgreSQL database successfully restored.`);
    } catch (err) {
      console.error('PostgreSQL restore failed:', err.message);
      process.exit(1);
    }
  }

  console.log('Regenerating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('Database restoration completed successfully.');
  console.log('==================================================');
}

runRestore();
