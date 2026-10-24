#!/usr/bin/env bash
# ==============================================================================
# CodeVita Practice Hub - PostgreSQL Automated Backup Script
# Usage: ./scripts/backup-db.sh [backup_dir]
# ==============================================================================

set -euo pipefail

BACKUP_DIR="${1:-./backups}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/codevita_db_${TIMESTAMP}.sql.gz"
RETENTION_DAYS=7

mkdir -p "${BACKUP_DIR}"

echo "=================================================="
echo " Starting CodeVita Practice Hub Database Backup"
echo " Timestamp: ${TIMESTAMP}"
echo " Destination: ${BACKUP_FILE}"
echo "=================================================="

# Check for DATABASE_URL or postgres credentials
if [ -z "${DATABASE_URL:-}" ]; then
  if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "Error: DATABASE_URL is not set."
  echo "Example: postgresql://postgres:postgres@localhost:5432/codevita_hub?schema=public"
  exit 1
fi

# Check if using SQLite (local development fallback)
if [[ "${DATABASE_URL}" == file:* ]] || [[ "${DATABASE_URL}" == *"dev.db"* ]]; then
  SQLITE_PATH="${DATABASE_URL#file:}"
  # Prisma resolves relative file paths relative to ./prisma if not found at root
  if [ ! -f "${SQLITE_PATH}" ] && [ -f "prisma/${SQLITE_PATH#./}" ]; then
    SQLITE_PATH="prisma/${SQLITE_PATH#./}"
  fi
  echo "Detected SQLite database at ${SQLITE_PATH}"
  if [ -f "${SQLITE_PATH}" ]; then
    gzip -c "${SQLITE_PATH}" > "${BACKUP_FILE}"
    echo "SQLite database backup successfully written to ${BACKUP_FILE}"
  else
    echo "Error: SQLite database file ${SQLITE_PATH} does not exist."
    exit 1
  fi
else
  # PostgreSQL production dump
  echo "Dumping PostgreSQL database from connection URL..."
  pg_dump "${DATABASE_URL}" --no-owner --clean --if-exists | gzip -9 > "${BACKUP_FILE}"
  echo "PostgreSQL dump successfully created at ${BACKUP_FILE}"
fi

# Compute SHA256 Checksum
if command -v sha256sum &> /dev/null; then
  CHECKSUM=$(sha256sum "${BACKUP_FILE}" | awk '{print $1}')
  echo "${CHECKSUM}  $(basename "${BACKUP_FILE}")" > "${BACKUP_FILE}.sha256"
  echo "SHA256 Checksum: ${CHECKSUM}"
fi

# Print size
FILE_SIZE=$(ls -lh "${BACKUP_FILE}" | awk '{print $5}')
echo "Backup Size: ${FILE_SIZE}"

# Enforce retention policy: delete backups older than RETENTION_DAYS
echo "Applying ${RETENTION_DAYS}-day retention cleanup in ${BACKUP_DIR}..."
find "${BACKUP_DIR}" -type f -name "codevita_db_*.sql.gz*" -mtime +"${RETENTION_DAYS}" -exec rm -f {} \;

# Optional S3 offsite synchronization
if [ -n "${S3_BACKUP_BUCKET:-}" ] && command -v aws &> /dev/null; then
  echo "Synchronizing backup with AWS S3: s3://${S3_BACKUP_BUCKET}/db-backups/..."
  aws s3 cp "${BACKUP_FILE}" "s3://${S3_BACKUP_BUCKET}/db-backups/$(basename "${BACKUP_FILE}")"
  echo "S3 synchronization complete."
fi

echo "Database backup completed successfully."
echo "=================================================="
