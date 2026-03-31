#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$APP_DIR"

CONTAINER_NAME="${OMH_DB_CONTAINER_NAME:-omh-postgres}"
DB_USER="${OMH_DB_USER:-postgres}"
DB_PASSWORD="${OMH_DB_PASSWORD:-postgres}"
DB_NAME="${OMH_DB_NAME:-omh_payroll_roster}"
DB_PORT="${OMH_DB_PORT:-5432}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is required for bootstrap. Install Docker and rerun."
  exit 1
fi

echo "Installing dependencies..."
npm install

if [ ! -f ".env" ]; then
  echo ".env not found. Creating from .env.example..."
  cp .env.example .env
fi

if ! docker ps --format '{{.Names}}' | rg "^${CONTAINER_NAME}$" >/dev/null 2>&1; then
  if docker ps -a --format '{{.Names}}' | rg "^${CONTAINER_NAME}$" >/dev/null 2>&1; then
    echo "Starting existing PostgreSQL container '${CONTAINER_NAME}'..."
    docker start "${CONTAINER_NAME}" >/dev/null
  else
    echo "Creating PostgreSQL container '${CONTAINER_NAME}'..."
    docker run \
      --name "${CONTAINER_NAME}" \
      -e "POSTGRES_USER=${DB_USER}" \
      -e "POSTGRES_PASSWORD=${DB_PASSWORD}" \
      -e "POSTGRES_DB=${DB_NAME}" \
      -p "${DB_PORT}:5432" \
      -d postgres:16 >/dev/null
  fi
fi

echo "Waiting for PostgreSQL readiness..."
ATTEMPTS=0
until docker exec "${CONTAINER_NAME}" pg_isready -U "${DB_USER}" -d "${DB_NAME}" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [ "${ATTEMPTS}" -ge 30 ]; then
    echo "Error: PostgreSQL container did not become ready in time."
    exit 1
  fi
  sleep 1
done

echo "Generating Prisma client..."
npm run prisma:generate

echo "Pushing Prisma schema to database..."
npm run prisma:push

echo "Starting Next.js development server..."
npm run dev
