-- Aislamiento multi-tenant por Row-Level Security.
--
-- Descubre dinámicamente toda tabla de `public` con columna `tenant_id` y le
-- aplica: ENABLE + FORCE RLS y una política de aislamiento por tenant. FORCE es
-- imprescindible porque la app conecta como owner (que de otro modo OMITE RLS).
-- El tenant se lee de `app.current_tenant`, que PrismaService setea con
-- set_config(..., true) LOCAL dentro de una transacción por operación.
--
-- Idempotente: se puede re-aplicar sin error (DROP POLICY IF EXISTS + ENABLE/FORCE
-- son seguros de repetir). Tablas hijas sin tenant_id (cotizacion_items, etc.) se
-- aíslan vía su tabla padre.

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
