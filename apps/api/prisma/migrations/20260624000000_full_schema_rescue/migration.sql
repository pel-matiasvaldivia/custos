-- ============================================================
-- CustOS — Migración completa (init + bridge + fases 4-6)
-- Generado: 2026-06-24
-- Orden: init → bridge_core_missing → contratos/rentabilidad
--        → auditoría/notificaciones → flota M6 → cuadrante M1
-- ============================================================

-- ========================
-- 1. INIT (20260619094224)
-- ========================

CREATE TABLE "tenants" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "factor_cobertura" DECIMAL(4,2) NOT NULL DEFAULT 4.20,
    "margen_objetivo" DECIMAL(5,4) NOT NULL DEFAULT 0.2500,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'OPERADOR',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vigiladores" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "legajo_nro" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "vigiladores_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "credenciales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "numero" TEXT,
    "organismo" TEXT,
    "emitida_el" DATE,
    "vence_el" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "credenciales_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "objetivos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "objetivos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "puestos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "requiere_arma" BOOLEAN NOT NULL DEFAULT false,
    "requiere_movil" BOOLEAN NOT NULL DEFAULT false,
    "esquema_horario" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "puestos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "asignaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "inicio_plan" TIMESTAMPTZ NOT NULL,
    "fin_plan" TIMESTAMPTZ NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PLANIFICADA',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asignaciones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "asistencias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "asignacion_id" UUID NOT NULL,
    "inicio_real" TIMESTAMPTZ,
    "fin_real" TIMESTAMPTZ,
    "metodo" TEXT,
    "lat" DECIMAL(9,6),
    "lng" DECIMAL(9,6),
    CONSTRAINT "asistencias_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "vigiladores_tenant_id_legajo_nro_key" ON "vigiladores"("tenant_id", "legajo_nro");
CREATE UNIQUE INDEX "objetivos_tenant_id_codigo_key" ON "objetivos"("tenant_id", "codigo");
CREATE UNIQUE INDEX "asistencias_asignacion_id_key" ON "asistencias"("asignacion_id");

ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "vigiladores" ADD CONSTRAINT "vigiladores_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "credenciales" ADD CONSTRAINT "credenciales_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "credenciales" ADD CONSTRAINT "credenciales_vigilador_id_fkey" FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "objetivos" ADD CONSTRAINT "objetivos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "puestos" ADD CONSTRAINT "puestos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "puestos" ADD CONSTRAINT "puestos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_vigilador_id_fkey" FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asistencias" ADD CONSTRAINT "asistencias_asignacion_id_fkey" FOREIGN KEY ("asignacion_id") REFERENCES "asignaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ========================
-- 2. BRIDGE CORE MISSING (20260624025000)
-- ========================

ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "razon_social" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "cuit" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "condicion_iva" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "direccion" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "logo_url" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "email_contacto" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "telefono_contacto" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "failed_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMPTZ;

CREATE TABLE "cotizaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "cliente_nombre" TEXT NOT NULL,
    "vencimiento" DATE NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "total_mensual" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cotizaciones_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cotizacion_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cotizacion_id" UUID NOT NULL,
    "puesto_nombre" TEXT NOT NULL,
    "horas_mensuales" INTEGER NOT NULL,
    "costo_hora" DECIMAL(12,2) NOT NULL,
    "margen" DECIMAL(5,4) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,
    CONSTRAINT "cotizacion_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "feriados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "feriados_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "configuracion_costos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL UNIQUE,
    "costo_hora_base" DECIMAL(12,2) NOT NULL,
    "cargas_sociales" DECIMAL(5,4) NOT NULL,
    "costos_uniforme" DECIMAL(12,2) NOT NULL,
    "otros_costos" DECIMAL(12,2) NOT NULL,
    "factor_ajuste" DECIMAL(5,4) NOT NULL DEFAULT 1.0,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "configuracion_costos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "novedades" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID,
    "vigilador_id" UUID,
    "tipo" TEXT NOT NULL,
    "prioridad" TEXT NOT NULL DEFAULT 'NORMAL',
    "descripcion" TEXT NOT NULL,
    "adjuntos" TEXT[],
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "novedades_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rondas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "hora_inicio" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora_fin" TIMESTAMPTZ,
    "estado" TEXT NOT NULL DEFAULT 'EN_PROGRESO',
    CONSTRAINT "rondas_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "umbrales_aprobacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "monto_max_supervisor" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "umbrales_aprobacion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "solicitudes_compra" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto_estimado" DECIMAL(14,2) NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "contrato_id" UUID,
    "vehiculo_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "solicitudes_compra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ordenes_compra" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "solicitud_id" UUID,
    "proveedor_nombre" TEXT NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "total_pagado" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'EN_APROBACION',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ordenes_compra_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "orden_compra_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "orden_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "cantidad_recibida" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "precio_unitario" DECIMAL(14,2) NOT NULL,
    "subtotal" DECIMAL(14,2) NOT NULL,
    "contrato_id" UUID,
    "vehiculo_id" UUID,
    CONSTRAINT "orden_compra_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vehiculos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "patente" TEXT NOT NULL UNIQUE,
    "marca" TEXT,
    "modelo" TEXT,
    "year" INTEGER,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehiculos_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "feriados" ADD CONSTRAINT "feriados_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_vigilador_id_fkey" FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "umbrales_aprobacion" ADD CONSTRAINT "umbrales_aprobacion_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "solicitudes_compra" ADD CONSTRAINT "solicitudes_compra_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "solicitudes_compra" ADD CONSTRAINT "solicitudes_compra_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orden_compra_items" ADD CONSTRAINT "orden_compra_items_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ==========================================
-- 3. CONTRATOS / RENTABILIDAD (20260624030000)
-- ==========================================

CREATE TABLE "contratos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "cliente_nombre" TEXT NOT NULL,
    "objetivo_id" UUID,
    "cotizacion_id" UUID,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVO',
    "inicio" DATE,
    "fin" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "contrato_facturacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "modo" TEXT NOT NULL,
    "tarifa_hora" DECIMAL(14,2),
    "abono_mensual" DECIMAL(14,2),
    "redondeo_min" INTEGER NOT NULL DEFAULT 0,
    "penaliza_hueco" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contrato_facturacion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "periodos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "desde" DATE NOT NULL,
    "hasta" DATE NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTO',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "periodos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "conciliacion_hh" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "periodo_id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "puesto_id" UUID,
    "vigilador_id" UUID,
    "hh_planificadas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_reales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_facturables" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_normales" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_nocturnas" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_extra" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hh_feriado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "congelada" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "conciliacion_hh_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "contratos_tenant_id_codigo_key" ON "contratos"("tenant_id", "codigo");
CREATE UNIQUE INDEX "contrato_facturacion_contrato_id_key" ON "contrato_facturacion"("contrato_id");

ALTER TABLE "contratos" ADD CONSTRAINT "contratos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "contrato_facturacion" ADD CONSTRAINT "contrato_facturacion_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contrato_facturacion" ADD CONSTRAINT "contrato_facturacion_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "periodos" ADD CONSTRAINT "periodos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ==========================================
-- 4. AUDITORÍA / NOTIFICACIONES (20260624040000)
-- ==========================================

CREATE TABLE "auditoria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "actor_id" UUID NOT NULL,
    "entidad" TEXT NOT NULL,
    "entidad_id" UUID NOT NULL,
    "accion" TEXT NOT NULL,
    "antes" JSONB,
    "despues" JSONB,
    "ocurrida_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "destinatario_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "enviada_en" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "auditoria_tenant_id_entidad_entidad_id_idx" ON "auditoria"("tenant_id", "entidad", "entidad_id");
CREATE INDEX "notificaciones_tenant_id_destinatario_id_leida_idx" ON "notificaciones"("tenant_id", "destinatario_id", "leida");

ALTER TABLE "auditoria" ADD CONSTRAINT "auditoria_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ========================
-- 5. FLOTA M6 (20260624050000)
-- ========================

ALTER TABLE "vehiculos" ADD COLUMN IF NOT EXISTS "codigo" TEXT;
ALTER TABLE "vehiculos" ADD COLUMN IF NOT EXISTS "tipo" TEXT;
ALTER TABLE "vehiculos" ADD COLUMN IF NOT EXISTS "km_actual" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "vehiculos" ADD COLUMN IF NOT EXISTS "estado" TEXT NOT NULL DEFAULT 'OPERATIVO';

CREATE TABLE "vehiculo_vencimientos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "vence_el" DATE NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'VIGENTE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "vehiculo_vencimientos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "planes_mantenimiento" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "disparo" TEXT NOT NULL,
    "cada_km" INTEGER,
    "cada_meses" INTEGER,
    "ultimo_km" INTEGER,
    "ultima_fecha" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "planes_mantenimiento_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ordenes_trabajo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "km_al_abrir" INTEGER,
    "taller" TEXT,
    "costo_total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ordenes_trabajo_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ot_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "orden_trabajo_id" UUID NOT NULL,
    "descripcion" TEXT NOT NULL,
    "costo" DECIMAL(14,2) NOT NULL,
    "oc_linea_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ot_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "cargas_combustible" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "litros" DECIMAL(8,2) NOT NULL,
    "importe" DECIMAL(14,2) NOT NULL,
    "km" INTEGER NOT NULL,
    "rendimiento" DECIMAL(6,2),
    "contrato_id" UUID,
    "objetivo_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cargas_combustible_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "asignaciones_movil" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "vehiculo_id" UUID NOT NULL,
    "objetivo_id" UUID,
    "contrato_id" UUID,
    "desde" TIMESTAMPTZ NOT NULL,
    "hasta" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asignaciones_movil_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "vehiculos_tenant_id_codigo_key" ON "vehiculos"("tenant_id", "codigo");

ALTER TABLE "vehiculo_vencimientos" ADD CONSTRAINT "vehiculo_vencimientos_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "planes_mantenimiento" ADD CONSTRAINT "planes_mantenimiento_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ot_items" ADD CONSTRAINT "ot_items_orden_trabajo_id_fkey" FOREIGN KEY ("orden_trabajo_id") REFERENCES "ordenes_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cargas_combustible" ADD CONSTRAINT "cargas_combustible_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones_movil" ADD CONSTRAINT "asignaciones_movil_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- ========================
-- 6. CUADRANTE M1 (20260624060000)
-- ========================

CREATE TABLE "reglas_laborales" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "jornada_max_semanal_h" INTEGER NOT NULL DEFAULT 48,
    "tope_semanal_con_extra_h" INTEGER NOT NULL DEFAULT 60,
    "descanso_min_entre_jornadas_h" INTEGER NOT NULL DEFAULT 12,
    "max_dias_consecutivos" INTEGER NOT NULL DEFAULT 6,
    "ventana_nocturna_inicio" TEXT NOT NULL DEFAULT '21:00',
    "ventana_nocturna_fin" TEXT NOT NULL DEFAULT '06:00',
    "factor_cobertura" DECIMAL(4,2) NOT NULL DEFAULT 4.20,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reglas_laborales_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "esquemas_turno" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "dias_ciclo" INTEGER NOT NULL,
    "definicion" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    CONSTRAINT "esquemas_turno_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "asignaciones_esquema" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "esquema_id" UUID NOT NULL,
    "posicion_ciclo" INTEGER NOT NULL DEFAULT 0,
    "fecha_ancla" DATE NOT NULL,
    "vigente_desde" DATE NOT NULL,
    "vigente_hasta" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "asignaciones_esquema_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "turnos_planificados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "vigilador_id" UUID NOT NULL,
    "asignacion_esquema_id" UUID,
    "inicio_plan" TIMESTAMPTZ NOT NULL,
    "fin_plan" TIMESTAMPTZ NOT NULL,
    "tipo_bloque" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'PLANIFICADA',
    "inicio_real" TIMESTAMPTZ,
    "fin_real" TIMESTAMPTZ,
    "metodo" TEXT,
    "asistencia_estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
    CONSTRAINT "turnos_planificados_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "relevos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "turno_original_id" UUID NOT NULL,
    "turno_relevo_id" UUID NOT NULL,
    "motivo" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "relevos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "puesto_cobertura" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "dotacion_requerida" INTEGER NOT NULL DEFAULT 1,
    "ventana" JSONB NOT NULL,
    CONSTRAINT "puesto_cobertura_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "reglas_laborales_tenant_id_key" ON "reglas_laborales"("tenant_id");
CREATE INDEX "turnos_planificados_tenant_id_vigilador_id_inicio_plan_idx" ON "turnos_planificados"("tenant_id", "vigilador_id", "inicio_plan");
CREATE INDEX "turnos_planificados_tenant_id_puesto_id_inicio_plan_idx" ON "turnos_planificados"("tenant_id", "puesto_id", "inicio_plan");

ALTER TABLE "reglas_laborales" ADD CONSTRAINT "reglas_laborales_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "esquemas_turno" ADD CONSTRAINT "esquemas_turno_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones_esquema" ADD CONSTRAINT "asignaciones_esquema_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "asignaciones_esquema" ADD CONSTRAINT "asignaciones_esquema_esquema_id_fkey" FOREIGN KEY ("esquema_id") REFERENCES "esquemas_turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "turnos_planificados" ADD CONSTRAINT "turnos_planificados_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "turnos_planificados" ADD CONSTRAINT "turnos_planificados_asignacion_esquema_id_fkey" FOREIGN KEY ("asignacion_esquema_id") REFERENCES "asignaciones_esquema"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "relevos" ADD CONSTRAINT "relevos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "puesto_cobertura" ADD CONSTRAINT "puesto_cobertura_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;