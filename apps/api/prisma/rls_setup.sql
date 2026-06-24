-- Script to enable RLS and create policies for all tables with tenant_id

DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'users', 'vigiladores', 'credenciales', 'objetivos', 'puestos', 
            'asignaciones', 'asistencias', 'feriados', 'configuracion_costos', 
            'cotizaciones', 'cotizacion_items', 'novedades', 'puntos_control', 
            'rondas', 'marcas_ronda',
            'contratos', 'contrato_facturacion', 'periodos', 'conciliacion_hh'
        )
    ) LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);
        
        -- Drop existing policy if any
        EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I', r.tablename);
        
        -- Create the policy
        -- current_setting('app.current_tenant') returns a text, we cast to UUID
        EXECUTE format(
            'CREATE POLICY tenant_isolation_policy ON %I USING (tenant_id = NULLIF(current_setting(''app.current_tenant'', TRUE), '''')::uuid)', 
            r.tablename
        );
        
        -- Also apply to updates/inserts
        EXECUTE format(
            'CREATE POLICY tenant_isolation_policy_mod ON %I FOR ALL WITH CHECK (tenant_id = NULLIF(current_setting(''app.current_tenant'', TRUE), '''')::uuid)', 
            r.tablename
        );

        RAISE NOTICE 'RLS enabled and policy created for table: %', r.tablename;
    END LOOP;
END $$;
