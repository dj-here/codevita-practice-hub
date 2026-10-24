#!/usr/bin/env node
/**
 * Cross-Platform Database Backup Utility for CodeVita Practice Hub
 * Usage: node scripts/backup-db.js [destination_directory]
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

async function runBackup() {
  loadEnv();

  const backupDir = path.resolve(process.argv[2] || './backups');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const backupFileName = `codevita_db_${timestamp}.sql.gz`;
  const backupFilePath = path.join(backupDir, backupFileName);

  console.log('==================================================');
  console.log(' CodeVita Practice Hub - Cross-Platform DB Backup');
  console.log(` Timestamp:   ${timestamp}`);
  console.log(` Destination: ${backupFilePath}`);
  console.log('==================================================');

  const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

  if (databaseUrl.startsWith('file:') || databaseUrl.includes('dev.db')) {
    let sqlitePath = databaseUrl.replace(/^file:/, '').trim();
    if (!fs.existsSync(sqlitePath)) {
      const prismaCandidate = path.join(process.cwd(), 'prisma', path.basename(sqlitePath));
      if (fs.existsSync(prismaCandidate)) {
        sqlitePath = prismaCandidate;
      }
    }

    if (!fs.existsSync(sqlitePath)) {
      console.error(`Error: SQLite database file not found at ${sqlitePath}`);
      process.exit(1);
    }

    console.log(`Backing up SQLite database from ${sqlitePath}...`);
    const fileContent = fs.readFileSync(sqlitePath);
    const compressed = zlib.gzipSync(fileContent, { level: 9 });
    fs.writeFileSync(backupFilePath, compressed);
    console.log(`Backup successfully compressed and written to ${backupFilePath}`);
  } else {
    console.log('Backing up PostgreSQL database using pg_dump...');
    try {
      const dumpOutput = execSync(`pg_dump "${databaseUrl}" --no-owner --clean --if-exists`, {
        maxBuffer: 1024 * 1024 * 100, // 100MB
      });
      const compressed = zlib.gzipSync(dumpOutput, { level: 9 });
      fs.writeFileSync(backupFilePath, compressed);
      console.log(`PostgreSQL backup written to ${backupFilePath}`);
    } catch (err) {
      console.error('PostgreSQL backup failed:', err.message);
      process.exit(1);
    }
  }

  // Calculate SHA256 Checksum
  const backupBytes = fs.readFileSync(backupFilePath);
  const hash = crypto.createHash('sha256').update(backupBytes).digest('hex');
  fs.writeFileSync(`${backupFilePath}.sha256`, `${hash}  ${backupFileName}\n`);
  console.log(`SHA256 Checksum: ${hash}`);
  console.log(`Archive Size:    ${(backupBytes.length / 1024).toFixed(2)} KB`);

  // Retention cleanup: remove archives older than 7 days
  const retentionMs = 7 * 24 * 60 * 60 * 1000;
  const files = fs.readdirSync(backupDir);
  for (const f of files) {
    if (f.startsWith('codevita_db_') && (f.endsWith('.sql.gz') || f.endsWith('.sha256'))) {
      const fullPath = path.join(backupDir, f);
      const stat = fs.statSync(fullPath);
      if (Date.now() - stat.mtimeMs > retentionMs) {
        console.log(`Removing old backup file: ${f}`);
        fs.unlinkSync(fullPath);
      }
    }
  }

  console.log('Database backup completed successfully.');
  console.log('==================================================');
}

runBackup();
