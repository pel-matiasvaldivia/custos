#!/bin/sh
set -e

echo "Starting CustOS API Entrypoint..."

# Wait for database if needed (optional, handled by retry in prisma)
# Running migrations
echo "Running database migrations..."
npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

# Seeding (creates superadmin if not exists)
echo "Running database seed..."
npx prisma db seed --schema=apps/api/prisma/schema.prisma

# Start the application
echo "Starting application..."
exec node apps/api/dist/src/main.js
