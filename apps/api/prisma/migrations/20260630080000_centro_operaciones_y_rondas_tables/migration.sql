-- Crea las tablas del módulo Centro de Operaciones (dispositivos, zonas,
-- eventos, incidentes, bitácora, procedimientos, contactos de emergencia,
-- programaciones horarias) y las de Rondas (puntos de control, marcas)
-- que existen en schema.prisma desde su definición original pero para las
-- que nunca se generó una migración. En producción cualquier endpoint de
-- estos módulos (CentroOperacionesController, RondaController) falla con
-- "the table ... does not exist in the current database".
--
-- Es segura de reaplicar (CREATE TABLE/INDEX con IF NOT EXISTS) y no toca
-- datos existentes en otras tablas.

CREATE TABLE IF NOT EXISTS "dispositivos" (
    "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL,
    "objetivo_id"   UUID NOT NULL,
    "tipo"          TEXT NOT NULL,
    "protocolo"     TEXT NOT NULL,
    "marca"         TEXT,
    "modelo"        TEXT,
    "nro_abonado"   TEXT,
    "params"        JSONB NOT NULL DEFAULT '{}',
    "estado"        TEXT NOT NULL DEFAULT 'FUERA_DE_LINEA',
    "ultimo_latido" TIMESTAMPTZ,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at"    TIMESTAMPTZ,
    "lat"           DOUBLE PRECISION,
    "lng"           DOUBLE PRECISION,
    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "zonas" (
    "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "numero_zona"    TEXT NOT NULL,
    "descripcion"    TEXT NOT NULL,
    "tipo"           TEXT NOT NULL,
    "particion"      TEXT,
    "puesto_id"      UUID,
    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "eventos" (
    "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID NOT NULL,
    "objetivo_id"    UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "zona_id"        UUID,
    "ts_evento"      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origen"         TEXT NOT NULL,
    "codigo_crudo"   TEXT,
    "tipo"           TEXT NOT NULL,
    "severidad"      TEXT NOT NULL,
    "particion"      TEXT,
    "usuario_panel"  TEXT,
    "id_origen"      TEXT,
    "en_prueba"      BOOLEAN NOT NULL DEFAULT false,
    "incidente_id"   UUID,
    "crudo"          JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "incidentes" (
    "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL,
    "objetivo_id"   UUID NOT NULL,
    "codigo"        TEXT NOT NULL,
    "tipo"          TEXT NOT NULL,
    "severidad"     TEXT NOT NULL,
    "estado"        TEXT NOT NULL DEFAULT 'NUEVO',
    "operador_id"   UUID,
    "sop_id"        UUID,
    "abierto_el"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tomado_el"     TIMESTAMPTZ,
    "despachado_el" TIMESTAMPTZ,
    "resuelto_el"   TIMESTAMPTZ,
    "disposicion"   TEXT,
    "resumen"       TEXT,
    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "incidente_bitacora" (
    "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"    UUID NOT NULL,
    "incidente_id" UUID NOT NULL,
    "ts"           TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id"     UUID,
    "accion"       TEXT NOT NULL,
    "detalle"      JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "incidente_bitacora_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "procedimientos" (
    "id"        UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "nombre"    TEXT NOT NULL,
    "aplica_a"  JSONB NOT NULL,
    "pasos"     JSONB NOT NULL,
    "activo"    BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "procedimientos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "contactos_emergencia" (
    "id"                UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"         UUID NOT NULL,
    "objetivo_id"       UUID NOT NULL,
    "orden"             INTEGER NOT NULL,
    "nombre"            TEXT NOT NULL,
    "telefono"          TEXT NOT NULL,
    "password_normal"   TEXT,
    "password_coaccion" TEXT,
    "rol"               TEXT,
    CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "puntos_control" (
    "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"  UUID NOT NULL,
    "puesto_id"  UUID NOT NULL,
    "nombre"     TEXT NOT NULL,
    "codigo_qr"  TEXT,
    "nfc_id"     TEXT,
    "lat"        DOUBLE PRECISION,
    "lng"        DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "puntos_control_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "marcas_ronda" (
    "id"               UUID NOT NULL DEFAULT gen_random_uuid(),
    "ronda_id"         UUID NOT NULL,
    "punto_control_id" UUID NOT NULL,
    "timestamp"        TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat"              DOUBLE PRECISION,
    "lng"              DOUBLE PRECISION,
    CONSTRAINT "marcas_ronda_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "programaciones_horarias" (
    "id"              UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"       UUID NOT NULL,
    "objetivo_id"     UUID NOT NULL,
    "particion"       TEXT,
    "dia_semana"      INTEGER NOT NULL,
    "abre_esperado"   TEXT,
    "cierra_esperado" TEXT,
    "tolerancia_min"  INTEGER NOT NULL DEFAULT 15,
    CONSTRAINT "programaciones_horarias_pkey" PRIMARY KEY ("id")
);

-- Índices y constraints únicos (réplica exacta de los @@unique/@@index del schema)
CREATE UNIQUE INDEX IF NOT EXISTS "dispositivos_tenant_id_nro_abonado_key" ON "dispositivos" ("tenant_id", "nro_abonado");
CREATE UNIQUE INDEX IF NOT EXISTS "zonas_tenant_id_dispositivo_id_numero_zona_key" ON "zonas" ("tenant_id", "dispositivo_id", "numero_zona");
CREATE INDEX IF NOT EXISTS "eventos_tenant_id_objetivo_id_ts_evento_idx" ON "eventos" ("tenant_id", "objetivo_id", "ts_evento" DESC);
CREATE UNIQUE INDEX IF NOT EXISTS "incidentes_tenant_id_codigo_key" ON "incidentes" ("tenant_id", "codigo");
CREATE UNIQUE INDEX IF NOT EXISTS "puntos_control_codigo_qr_key" ON "puntos_control" ("codigo_qr");
CREATE UNIQUE INDEX IF NOT EXISTS "puntos_control_nfc_id_key" ON "puntos_control" ("nfc_id");

-- Foreign keys (solo las relaciones declaradas explícitamente en schema.prisma)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dispositivos_tenant_id_fkey') THEN
    ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dispositivos_objetivo_id_fkey') THEN
    ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'zonas_dispositivo_id_fkey') THEN
    ALTER TABLE "zonas" ADD CONSTRAINT "zonas_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eventos_tenant_id_fkey') THEN
    ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eventos_objetivo_id_fkey') THEN
    ALTER TABLE "eventos" ADD CONSTRAINT "eventos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eventos_dispositivo_id_fkey') THEN
    ALTER TABLE "eventos" ADD CONSTRAINT "eventos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eventos_zona_id_fkey') THEN
    ALTER TABLE "eventos" ADD CONSTRAINT "eventos_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'eventos_incidente_id_fkey') THEN
    ALTER TABLE "eventos" ADD CONSTRAINT "eventos_incidente_id_fkey" FOREIGN KEY ("incidente_id") REFERENCES "incidentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'incidentes_tenant_id_fkey') THEN
    ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'incidentes_objetivo_id_fkey') THEN
    ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'incidente_bitacora_incidente_id_fkey') THEN
    ALTER TABLE "incidente_bitacora" ADD CONSTRAINT "incidente_bitacora_incidente_id_fkey" FOREIGN KEY ("incidente_id") REFERENCES "incidentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'procedimientos_tenant_id_fkey') THEN
    ALTER TABLE "procedimientos" ADD CONSTRAINT "procedimientos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contactos_emergencia_objetivo_id_fkey') THEN
    ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'puntos_control_tenant_id_fkey') THEN
    ALTER TABLE "puntos_control" ADD CONSTRAINT "puntos_control_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'puntos_control_puesto_id_fkey') THEN
    ALTER TABLE "puntos_control" ADD CONSTRAINT "puntos_control_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marcas_ronda_ronda_id_fkey') THEN
    ALTER TABLE "marcas_ronda" ADD CONSTRAINT "marcas_ronda_ronda_id_fkey" FOREIGN KEY ("ronda_id") REFERENCES "rondas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'marcas_ronda_punto_control_id_fkey') THEN
    ALTER TABLE "marcas_ronda" ADD CONSTRAINT "marcas_ronda_punto_control_id_fkey" FOREIGN KEY ("punto_control_id") REFERENCES "puntos_control"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'programaciones_horarias_tenant_id_fkey') THEN
    ALTER TABLE "programaciones_horarias" ADD CONSTRAINT "programaciones_horarias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'programaciones_horarias_objetivo_id_fkey') THEN
    ALTER TABLE "programaciones_horarias" ADD CONSTRAINT "programaciones_horarias_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Re-aplica el aislamiento por RLS a toda tabla con tenant_id (incluye las
-- tablas nuevas creadas arriba). Idempotente: ver 20260629000000_enable_rls_force.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public' AND column_name = 'tenant_id'
    GROUP BY table_name
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.table_name);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', r.table_name);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation ON %I', r.table_name);
    EXECUTE format(
      'CREATE POLICY tenant_isolation ON %I USING (tenant_id = NULLIF(current_setting(''app.current_tenant'', TRUE), '''')::uuid) WITH CHECK (tenant_id = NULLIF(current_setting(''app.current_tenant'', TRUE), '''')::uuid)',
      r.table_name
    );
  END LOOP;
END $$;
