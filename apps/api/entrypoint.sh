#!/bin/sh
set -e

echo "CustOS API · arranque"

SCHEMA=apps/api/prisma/schema.prisma
# Migraciones y seed corren como rol admin (owner): aplican DDL, habilitan RLS y
# siembran datos sin scope de tenant. La app corre con DATABASE_URL (rol de
# mínimos privilegios) para que RLS aísle de verdad — un superusuario OMITE RLS.
# Si no se define MIGRATE_DATABASE_URL, cae a DATABASE_URL (compatibilidad).
ADMIN_URL="${MIGRATE_DATABASE_URL:-$DATABASE_URL}"

echo "Migraciones (rol admin)..."
DATABASE_URL="$ADMIN_URL" npx prisma migrate deploy --schema="$SCHEMA"

echo "Seed (rol admin)..."
DATABASE_URL="$ADMIN_URL" npx prisma db seed --schema="$SCHEMA" || echo "Seed con error no fatal, continúa."

echo "Iniciando aplicación (rol de mínimos privilegios)..."
exec node --max-old-space-size=2048 apps/api/dist/src/main.js
