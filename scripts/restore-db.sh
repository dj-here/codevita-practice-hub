#!/usr/bin/env bash
# ==============================================================================
# CodeVita Practice Hub - PostgreSQL Automated Restore Script
# Usage: ./scripts/restore-db.sh <backup_file.sql.gz> [--yes]
# ==============================================================================

set -euo pipefail

BACKUP_FILE="${1:-}"
FORCE_FLAG="${2:-}"

if [ -z "${BACKUP_FILE}" ] || [ ! -f "${BACKUP_FILE}" ]; then
  echo "Usage: $0 <path_to_backup.sql.gz> [--yes]"
  echo "Error: Backup file '${BACKUP_FILE}' not found."
  exit 1
fi

echo "=================================================="
echo " Starting CodeVita Practice Hub Database Restore"
echo " Backup File: ${BACKUP_FILE}"
echo "=================================================="

# Check for DATABASE_URL
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
  exit 1
fi

# Optional checksum verification
if [ -f "${BACKUP_FILE}.sha256" ] && command -v sha256sum &> /dev/null; then
  echo "Verifying SHA256 integrity..."
  cd "$(dirname "${BACKUP_FILE}")"
  sha256sum -c "$(basename "${BACKUP_FILE}.sha256")"
  cd - > /dev/null
  echo "Checksum verification passed."
fi

# Confirm destructive restoration
if [ "${FORCE_FLAG}" != "--yes" ] && [ "${FORCE_FLAG}" != "-y" ]; then
  echo ""
  echo "WARNING: Restoring will overwrite the current database contents!"
  read -rp "Are you sure you want to proceed? (type 'yes' to confirm): " CONFIRM
  if [ "${CONFIRM}" != "yes" ]; then
    echo "Restore cancelled by user."
    exit 0
  fi
fi

if [[ "${DATABASE_URL}" == file:* ]] || [[ "${DATABASE_URL}" == *"dev.db"* ]]; then
  SQLITE_PATH="${DATABASE_URL#file:}"
  if [ ! -f "${SQLITE_PATH}" ] && [ -f "prisma/${SQLITE_PATH#./}" ]; then
    SQLITE_PATH="prisma/${SQLITE_PATH#./}"
  fi
  echo "Restoring SQLite database to ${SQLITE_PATH}..."
  gunzip -c "${BACKUP_FILE}" > "${SQLITE_PATH}"
  echo "SQLite restore complete."
else
  echo "Restoring PostgreSQL database from gzip archive..."
  gunzip -c "${BACKUP_FILE}" | psql "${DATABASE_URL}"
  echo "PostgreSQL restore complete."
fi

echo "Regenerating Prisma client..."
npx prisma generate

echo "=================================================="
echo " Database restoration completed successfully."
echo "=================================================="
