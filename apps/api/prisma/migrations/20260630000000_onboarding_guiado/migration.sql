-- UX guiada y carga masiva (PROMPT_UX_ONBOARDING_GUIADO.md).
-- Agrega campos de domicilio/foto/documentación a Vigilador y Credencial,
-- documento_url a vencimientos de flota, y el módulo de Herramientas/Equipos.

ALTER TABLE vigiladores
  ADD COLUMN IF NOT EXISTS foto_url TEXT,
  ADD COLUMN IF NOT EXISTS domicilio TEXT,
  ADD COLUMN IF NOT EXISTS localidad TEXT,
  ADD COLUMN IF NOT EXISTS provincia TEXT,
  ADD COLUMN IF NOT EXISTS codigo_postal TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emerg_nombre TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emerg_telefono TEXT,
  ADD COLUMN IF NOT EXISTS contacto_emerg_vinculo TEXT,
  ADD COLUMN IF NOT EXISTS completitud TEXT NOT NULL DEFAULT 'INCOMPLETO';

ALTER TABLE credenciales
  ADD COLUMN IF NOT EXISTS documento_url TEXT;

ALTER TABLE vehiculo_vencimientos
  ADD COLUMN IF NOT EXISTS documento_url TEXT;

CREATE TABLE IF NOT EXISTS herramientas (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    uuid NOT NULL REFERENCES tenants(id),
  codigo       text NOT NULL,
  tipo         text NOT NULL,
  descripcion  text NOT NULL,
  numero_serie text,
  estado       text NOT NULL DEFAULT 'DISPONIBLE',
  foto_url     text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  deleted_at   timestamptz,
  UNIQUE (tenant_id, codigo)
);

CREATE TABLE IF NOT EXISTS herramienta_asignaciones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      uuid NOT NULL REFERENCES tenants(id),
  herramienta_id uuid NOT NULL REFERENCES herramientas(id),
  vigilador_id   uuid NOT NULL REFERENCES vigiladores(id),
  entregada_el   timestamptz NOT NULL DEFAULT now(),
  devuelta_el    timestamptz,
  observaciones  text
);

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
