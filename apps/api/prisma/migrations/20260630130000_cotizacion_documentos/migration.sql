-- Add document fields to cotizaciones
ALTER TABLE "cotizaciones" ADD COLUMN IF NOT EXISTS "documento_key" TEXT;
ALTER TABLE "cotizaciones" ADD COLUMN IF NOT EXISTS "documento_generado_at" TIMESTAMPTZ;

-- Add logo_key to configuraciones_contrato
ALTER TABLE "configuraciones_contrato" ADD COLUMN IF NOT EXISTS "logo_key" TEXT;

-- Create cotizacion_documentos table for version history
CREATE TABLE IF NOT EXISTS "cotizacion_documentos" (
  "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
  "cotizacion_id"   UUID        NOT NULL,
  "tenant_id"       UUID        NOT NULL,
  "version"         INTEGER     NOT NULL,
  "documento_key"   TEXT        NOT NULL,
  "generado_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
  "notas"           TEXT,
  CONSTRAINT "cotizacion_documentos_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "cotizacion_documentos_cotizacion_id_fkey"
    FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE CASCADE,
  CONSTRAINT "cotizacion_documentos_tenant_id_fkey"
    FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "cotizacion_documentos_cotizacion_id_version_key"
  ON "cotizacion_documentos"("cotizacion_id", "version");
