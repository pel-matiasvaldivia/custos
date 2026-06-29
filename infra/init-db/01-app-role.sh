#!/bin/sh
# Crea el rol de aplicación de mínimos privilegios. Corre UNA vez, al inicializar
# el volumen de Postgres (/docker-entrypoint-initdb.d), como superusuario.
#
# La app DEBE conectar con este rol (no con `postgres`): los superusuarios OMITEN
# Row-Level Security, así que conectar como `postgres` anula todo el aislamiento
# multi-tenant. ALTER DEFAULT PRIVILEGES asegura que las tablas creadas más tarde
# por las migraciones (que corren como owner) queden accesibles a este rol.
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'custos_app') THEN
      CREATE ROLE custos_app LOGIN PASSWORD '${APP_DB_PASSWORD:-app_pass}';
    END IF;
  END \$\$;

  GRANT USAGE ON SCHEMA public TO custos_app;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO custos_app;
  GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO custos_app;

  -- Tablas/secuencias que cree el owner en el futuro (migraciones):
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO custos_app;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO custos_app;
EOSQL

echo "Rol custos_app provisionado."
