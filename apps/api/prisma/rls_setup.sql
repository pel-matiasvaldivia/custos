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
            -- Sólo tablas con columna tenant_id. Las tablas hijas sin tenant_id
            -- (cotizacion_items, marcas_ronda, orden_compra_items) se aíslan vía
            -- su tabla padre a nivel de aplicación.
            'users', 'vigiladores', 'credenciales', 'objetivos', 'puestos',
            'asignaciones', 'asistencias', 'feriados', 'configuracion_costos',
            'cotizaciones', 'novedades', 'puntos_control', 'rondas',
            'umbrales_aprobacion', 'solicitudes_compra', 'ordenes_compra',
            'vehiculos', 'dispositivos', 'zonas', 'eventos', 'incidentes',
            'incidente_bitacora', 'procedimientos', 'contactos_emergencia',
            'programaciones_horarias',
            'contratos', 'contrato_facturacion', 'periodos', 'conciliacion_hh',
            'auditoria', 'notificaciones',
            'vehiculo_vencimientos', 'planes_mantenimiento', 'ordenes_trabajo',
            'ot_items', 'cargas_combustible', 'asignaciones_movil'
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

-- ⚠️ IMPORTANTE — para que el RLS REALMENTE aísle (hoy es defensa en profundidad,
-- el aislamiento efectivo lo dan los `where: { tenant_id }` de cada servicio):
--   1) La app conecta como `postgres` (owner), que OMITE RLS salvo FORCE.
--      Falta: ALTER TABLE <t> FORCE ROW LEVEL SECURITY;  (no se habilita aún
--      porque requiere validar el seteo transaccional del tenant — ver punto 3).
--   2) Idealmente conectar con un rol de mínimos privilegios (no owner).
--   3) set_config('app.current_tenant', ...) debe ser transaccional (LOCAL=true)
--      dentro de una transacción por request; con pool de conexiones el seteo
--      actual (LOCAL=false) puede caer en otra conexión. Migrar PrismaService a
--      `$extends` envolviendo cada operación en $transaction con set_config local.
