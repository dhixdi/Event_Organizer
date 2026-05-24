#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  EventSync Backend — Startup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "[1/2] Menjalankan Sequelize migrations..."

# Jika DATABASE_URL belum di-set, build dari variabel individual
if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT:-3306}/${DB_NAME}"
  echo "  → DATABASE_URL di-build dari env vars individual"
fi

npx sequelize-cli db:migrate \
  --config src/config/database.js \
  --migrations-path migrations \
  --env production

echo "  ✓ Migration selesai"

echo "[2/2] Memulai server..."
exec node src/server.js
