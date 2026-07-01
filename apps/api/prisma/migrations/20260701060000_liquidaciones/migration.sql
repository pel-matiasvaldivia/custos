-- Liquidaciones: modo de cálculo por tenant, valor hora/categoría por vigilador,
-- recargos en la regla laboral, y tablas de liquidaciones, sus items y adelantos
-- de sueldo (con devolución en cuotas).
--
-- Segura de reaplicar: ADD COLUMN IF NOT EXISTS / CREATE TABLE IF NOT EXISTS y el
-- bloque final de RLS son idempotentes. Las tablas nuevas quedan aisladas por
-- tenant con la misma política que el resto (FORCE ROW LEVEL SECURITY).

-- ── Columnas nuevas en tablas existentes ──
ALTER TABLE "tenants"
  ADD COLUMN IF NOT EXISTS "modo_liquidacion" TEXT NOT NULL DEFAULT 'VALOR_HORA_MANUAL';

ALTER TABLE "vigiladores"
  ADD COLUMN IF NOT EXISTS "valor_hora" DECIMAL(12,2),
  ADD COLUMN IF NOT EXISTS "categoria_laboral" TEXT;

ALTER TABLE "reglas_laborales"
  ADD COLUMN IF NOT EXISTS "recargo_nocturno_pct" INTEGER NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS "recargo_extra_pct" INTEGER NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS "recargo_feriado_pct" INTEGER NOT NULL DEFAULT 100;

-- ── Tabla: liquidaciones (cabecera por período) ──
CREATE TABLE IF NOT EXISTS "liquidaciones" (
    "id"            UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"     UUID NOT NULL,
    "periodo_desde" TIMESTAMPTZ NOT NULL,
    "periodo_hasta" TIMESTAMPTZ NOT NULL,
    "modo"          TEXT NOT NULL DEFAULT 'VALOR_HORA_MANUAL',
    "estado"        TEXT NOT NULL DEFAULT 'BORRADOR',
    "total_neto"    DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"    TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "liquidaciones_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "liquidaciones_tenant_id_periodo_desde_idx"
  ON "liquidaciones" ("tenant_id", "periodo_desde");

-- ── Tabla: liquidacion_items (detalle por vigilador) ──
CREATE TABLE IF NOT EXISTS "liquidacion_items" (
    "id"              UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"       UUID NOT NULL,
    "liquidacion_id"  UUID NOT NULL,
    "vigilador_id"    UUID NOT NULL,
    "hh_trabajadas"   DECIMAL(8,2) NOT NULL DEFAULT 0,
    "hh_nocturnas"    DECIMAL(8,2) NOT NULL DEFAULT 0,
    "hh_extra"        DECIMAL(8,2) NOT NULL DEFAULT 0,
    "hh_ausentes"     DECIMAL(8,2) NOT NULL DEFAULT 0,
    "llegadas_tarde"  INTEGER NOT NULL DEFAULT 0,
    "suspension_dias" INTEGER NOT NULL DEFAULT 0,
    "bruto"           DECIMAL(14,2) NOT NULL DEFAULT 0,
    "descuentos"      DECIMAL(14,2) NOT NULL DEFAULT 0,
    "adelanto_desc"   DECIMAL(14,2) NOT NULL DEFAULT 0,
    "neto"            DECIMAL(14,2) NOT NULL DEFAULT 0,
    CONSTRAINT "liquidacion_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "liquidacion_items_tenant_id_liquidacion_id_idx"
  ON "liquidacion_items" ("tenant_id", "liquidacion_id");

-- ── Tabla: adelantos (adelanto de sueldo con cuotas) ──
CREATE TABLE IF NOT EXISTS "adelantos" (
    "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"    UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "novedad_id"   UUID,
    "monto"        DECIMAL(14,2) NOT NULL,
    "cuotas"       INTEGER NOT NULL DEFAULT 1,
    "cuotas_pagas" INTEGER NOT NULL DEFAULT 0,
    "saldo"        DECIMAL(14,2) NOT NULL,
    "estado"       TEXT NOT NULL DEFAULT 'VIGENTE',
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "adelantos_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "adelantos_tenant_id_vigilador_id_idx"
  ON "adelantos" ("tenant_id", "vigilador_id");

-- ── Foreign keys (idempotentes vía guardas) ──
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'liquidaciones_tenant_id_fkey') THEN
    ALTER TABLE "liquidaciones" ADD CONSTRAINT "liquidaciones_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'liquidacion_items_tenant_id_fkey') THEN
    ALTER TABLE "liquidacion_items" ADD CONSTRAINT "liquidacion_items_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'liquidacion_items_liquidacion_id_fkey') THEN
    ALTER TABLE "liquidacion_items" ADD CONSTRAINT "liquidacion_items_liquidacion_id_fkey"
      FOREIGN KEY ("liquidacion_id") REFERENCES "liquidaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'liquidacion_items_vigilador_id_fkey') THEN
    ALTER TABLE "liquidacion_items" ADD CONSTRAINT "liquidacion_items_vigilador_id_fkey"
      FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'adelantos_tenant_id_fkey') THEN
    ALTER TABLE "adelantos" ADD CONSTRAINT "adelantos_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'adelantos_vigilador_id_fkey') THEN
    ALTER TABLE "adelantos" ADD CONSTRAINT "adelantos_vigilador_id_fkey"
      FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- ── Row-Level Security: reaplica aislamiento por tenant a todas las tablas con
--    columna tenant_id (incluye las tres nuevas). Mismo patrón que el resto. ──
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
