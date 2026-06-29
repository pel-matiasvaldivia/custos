#!/bin/sh
# Provisiona el rol de app de mínimos privilegios en una base EXISTENTE.
# (Las bases nuevas lo hacen solas vía init-db/01-app-role.sh.)
#
# Correr UNA vez contra producción, como superusuario/owner, ANTES de cambiar la
# app a conectar como custos_app:
#
#   ADMIN_URL="postgresql://postgres:PASS@HOST:5432/custos_db" \
#   APP_DB_PASSWORD="el-mismo-password-que-pondrás-en-.env" \
#   ./infra/provision-app-role.sh
#
# Es idempotente: se puede correr de nuevo sin romper nada.
set -e

: "${ADMIN_URL:?Definí ADMIN_URL (conexión de superusuario/owner)}"
: "${APP_DB_PASSWORD:?Definí APP_DB_PASSWORD}"

psql "$ADMIN_URL" -v ON_ERROR_STOP=1 -v app_pw="$APP_DB_PASSWORD" <<'SQL'
SELECT format('CREATE ROLE custos_app LOGIN PASSWORD %L', :'app_pw')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'custos_app') \gexec

-- Tablas y secuencias que YA existen:
GRANT USAGE ON SCHEMA public TO custos_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO custos_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO custos_app;

-- Tablas y secuencias que cree el owner en el futuro (migraciones):
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO custos_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO custos_app;
SQL

echo "Rol custos_app provisionado en la base existente."
