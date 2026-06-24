#!/bin/sh
set -e

echo "Starting CustOS API Entrypoint..."

# Wait for database if needed (optional, handled by retry in prisma)
# Running migrations
echo "Running database migrations..."
# Attempting deploy. If it fails due to P3009 (failed migration in DB), we try to resolve the specific known failure.
if ! npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma; then
  echo "Migration failed. Checking for P3009 state..."
  # If known failure, attempt resolve --rolled-back
  npx prisma migrate resolve --rolled-back 20260624030000_add_contratos_rentabilidad --schema=apps/api/prisma/schema.prisma || true
  # Retry deploy
  npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma
fi

# Seeding (creates superadmin if not exists)
echo "Running database seed..."
npx prisma db seed --schema=apps/api/prisma/schema.prisma || echo "Seed encountered non-fatal error, continuing..."

# Start the application
echo "Starting application..."
exec node apps/api/dist/src/main.js
