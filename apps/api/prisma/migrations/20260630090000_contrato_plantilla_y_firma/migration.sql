-- Agrega la tabla configuraciones_contrato (plantilla HTML del contrato +
-- firma digitalizada del Director/Responsable, configurables por tenant
-- desde Configuración > Contratos) y los campos para registrar el documento
-- PDF generado en cada Contrato. Cierra el gap de la Etapa 3 del camino
-- crítico: emisión del contrato firmado al aceptar una Cotización.

CREATE TABLE IF NOT EXISTS "configuraciones_contrato" (
    "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID NOT NULL,
    "plantilla_html" TEXT NOT NULL,
    "firma_key"      TEXT,
    "firma_nombre"   TEXT,
    "firma_cargo"    TEXT,
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "configuraciones_contrato_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "configuraciones_contrato_tenant_id_key" ON "configuraciones_contrato"("tenant_id");

ALTER TABLE "contratos" ADD COLUMN IF NOT EXISTS "documento_key" TEXT;
ALTER TABLE "contratos" ADD COLUMN IF NOT EXISTS "documento_generado_at" TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'configuraciones_contrato_tenant_id_fkey'
  ) THEN
    ALTER TABLE "configuraciones_contrato" ADD CONSTRAINT "configuraciones_contrato_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Re-aplica el aislamiento por RLS a toda tabla con tenant_id (incluye la
-- tabla nueva creada arriba). Idempotente: ver 20260629000000_enable_rls_force.
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
