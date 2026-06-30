-- Cliente/Empresa como entidad real (PROCESO_VENTA_A_COBRANZA.md, roadmap #1).
-- cliente_id es opcional en cotizaciones/contratos/objetivos: se conserva
-- cliente_nombre como snapshot para no romper flujos existentes (carga
-- rápida de cotizaciones sin alta previa de cliente).

CREATE TABLE IF NOT EXISTS clientes (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         uuid NOT NULL REFERENCES tenants(id),
  razon_social      text NOT NULL,
  nombre_fantasia   text,
  cuit              text,
  domicilio         text,
  localidad         text,
  provincia         text,
  contacto_nombre   text,
  contacto_email    text,
  contacto_telefono text,
  estado            text NOT NULL DEFAULT 'ACTIVO',
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  deleted_at        timestamptz
);

ALTER TABLE objetivos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES clientes(id);
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES clientes(id);
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES clientes(id);

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
