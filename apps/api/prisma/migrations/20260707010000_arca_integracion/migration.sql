-- Integración ARCA (ex-AFIP): configuración fiscal por tenant + comprobantes
-- electrónicos con CAE. Ambas tablas con RLS por tenant (fail-closed).

-- 0. Vigilador: CUIL completo y fecha de ingreso (necesarios para el LSD y las
-- altas ante ARCA; la importación de nómina los completa).
ALTER TABLE "vigiladores" ADD COLUMN IF NOT EXISTS "cuil" TEXT;
ALTER TABLE "vigiladores" ADD COLUMN IF NOT EXISTS "fecha_ingreso" DATE;

-- 1. Configuración fiscal / credenciales ARCA por tenant.
CREATE TABLE IF NOT EXISTS "configuracion_arca" (
    "id"                  UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"           UUID NOT NULL,
    "ambiente"            TEXT NOT NULL DEFAULT 'HOMOLOGACION',
    "cuit_emisor"         TEXT,
    "condicion_iva"       TEXT,
    "puntos_venta"        INTEGER[] NOT NULL DEFAULT '{}',
    "certificado_cifrado" TEXT,
    "clave_cifrada"       TEXT,
    "ta_token"            TEXT,
    "ta_sign"             TEXT,
    "ta_expira"           TIMESTAMPTZ,
    "created_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "configuracion_arca_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'configuracion_arca_tenant_id_key') THEN
    ALTER TABLE "configuracion_arca" ADD CONSTRAINT "configuracion_arca_tenant_id_key" UNIQUE ("tenant_id");
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'configuracion_arca_tenant_id_fkey') THEN
    ALTER TABLE "configuracion_arca"
      ADD CONSTRAINT "configuracion_arca_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "configuracion_arca" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "configuracion_arca" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "configuracion_arca";
CREATE POLICY tenant_isolation ON "configuracion_arca"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);

-- 2. Comprobantes electrónicos emitidos.
CREATE TABLE IF NOT EXISTS "facturas" (
    "id"               UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"        UUID NOT NULL,
    "cliente_id"       UUID,
    "cliente_nombre"   TEXT NOT NULL,
    "tipo_comprobante" INTEGER NOT NULL,
    "punto_venta"      INTEGER NOT NULL,
    "numero"           INTEGER NOT NULL,
    "doc_tipo"         INTEGER NOT NULL,
    "doc_nro"          TEXT NOT NULL,
    "concepto"         INTEGER NOT NULL DEFAULT 2,
    "importe_neto"     DECIMAL(14, 2) NOT NULL,
    "importe_iva"      DECIMAL(14, 2) NOT NULL,
    "importe_total"    DECIMAL(14, 2) NOT NULL,
    "cae"              TEXT,
    "cae_vencimiento"  DATE,
    "estado"           TEXT NOT NULL DEFAULT 'PENDIENTE',
    "fecha_emision"    DATE NOT NULL,
    "items"            JSONB NOT NULL,
    "observaciones"    JSONB,
    "documento_key"    TEXT,
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'facturas_tenant_id_fkey') THEN
    ALTER TABLE "facturas"
      ADD CONSTRAINT "facturas_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'facturas_cliente_id_fkey') THEN
    ALTER TABLE "facturas"
      ADD CONSTRAINT "facturas_cliente_id_fkey"
      FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'facturas_tenant_id_punto_venta_tipo_comprobante_numero_key') THEN
    ALTER TABLE "facturas"
      ADD CONSTRAINT "facturas_tenant_id_punto_venta_tipo_comprobante_numero_key"
      UNIQUE ("tenant_id", "punto_venta", "tipo_comprobante", "numero");
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "facturas_tenant_id_fecha_emision_idx"
  ON "facturas" ("tenant_id", "fecha_emision");

ALTER TABLE "facturas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "facturas" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "facturas";
CREATE POLICY tenant_isolation ON "facturas"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);
