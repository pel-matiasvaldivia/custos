-- Bridge migration: creates tables and columns missing between 'init' and Phases 4-6
-- Includes: Cotizaciones, Novedades, Compras, Dispositivos, Eventos, Incidentes, etc.

-- AlterTable tenants (add missing fields if not present)
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "razon_social" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "cuit" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "condicion_iva" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "direccion" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "logo_url" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "email_contacto" TEXT;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "telefono_contacto" TEXT;

-- AlterTable users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "failed_attempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "locked_until" TIMESTAMPTZ;

-- CreateTable cotizaciones
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

-- CreateTable cotizacion_items
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

-- CreateTable novedades
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

-- CreateTable puntos_control
CREATE TABLE "puntos_control" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "codigo_qr" TEXT,
    "nfc_id" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "puntos_control_pkey" PRIMARY KEY ("id")
);

-- CreateTable rondas
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

-- CreateTable marcas_ronda
CREATE TABLE "marcas_ronda" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ronda_id" UUID NOT NULL,
    "punto_control_id" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    CONSTRAINT "marcas_ronda_pkey" PRIMARY KEY ("id")
);

-- CreateTable umbrales_aprobacion
CREATE TABLE "umbrales_aprobacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "monto_max_supervisor" DECIMAL(14,2) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "umbrales_aprobacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable solicitudes_compra
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

-- CreateTable ordenes_compra
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

-- CreateTable orden_compra_items
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

-- CreateTable dispositivos
CREATE TABLE "dispositivos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "marca" TEXT,
    "modelo" TEXT,
    "nro_abonado" TEXT,
    "params" JSONB NOT NULL DEFAULT '{}',
    "estado" TEXT NOT NULL DEFAULT 'FUERA_DE_LINEA',
    "ultimo_latido" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable zonas
CREATE TABLE "zonas" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "numero_zona" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "particion" TEXT,
    "puesto_id" UUID,
    CONSTRAINT "zonas_pkey" PRIMARY KEY ("id")
);

-- CreateTable eventos
CREATE TABLE "eventos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "zona_id" UUID,
    "ts_evento" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origen" TEXT NOT NULL,
    "codigo_crudo" TEXT,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL,
    "particion" TEXT,
    "usuario_panel" TEXT,
    "id_origen" TEXT,
    "en_prueba" BOOLEAN NOT NULL DEFAULT false,
    "incidente_id" UUID,
    "crudo" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable incidentes
CREATE TABLE "incidentes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'NUEVO',
    "operador_id" UUID,
    "sop_id" UUID,
    "abierto_el" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tomado_el" TIMESTAMPTZ,
    "despachado_el" TIMESTAMPTZ,
    "resuelto_el" TIMESTAMPTZ,
    "disposicion" TEXT,
    "resumen" TEXT,
    CONSTRAINT "incidentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable incidente_bitacora
CREATE TABLE "incidente_bitacora" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "incidente_id" UUID NOT NULL,
    "ts" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" UUID,
    "accion" TEXT NOT NULL,
    "detalle" JSONB NOT NULL DEFAULT '{}',
    CONSTRAINT "incidente_bitacora_pkey" PRIMARY KEY ("id")
);

-- CreateTable procedimientos
CREATE TABLE "procedimientos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "aplica_a" JSONB NOT NULL,
    "pasos" JSONB NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "procedimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable contactos_emergencia
CREATE TABLE "contactos_emergencia" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "orden" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password_normal" TEXT,
    "password_coaccion" TEXT,
    "rol" TEXT,
    CONSTRAINT "contactos_emergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable programaciones_horarias
CREATE TABLE "programaciones_horarias" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "objetivo_id" UUID NOT NULL,
    "particion" TEXT,
    "dia_semana" INTEGER NOT NULL,
    "abre_esperado" TEXT,
    "cierra_esperado" TEXT,
    "tolerancia_min" INTEGER NOT NULL DEFAULT 15,
    CONSTRAINT "programaciones_horarias_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "tenants_cuit_key" ON "tenants"("cuit");
CREATE UNIQUE INDEX IF NOT EXISTS "puntos_control_codigo_qr_key" ON "puntos_control"("codigo_qr");
CREATE UNIQUE INDEX IF NOT EXISTS "puntos_control_nfc_id_key" ON "puntos_control"("nfc_id");
CREATE UNIQUE INDEX IF NOT EXISTS "dispositivos_tenant_id_nro_abonado_key" ON "dispositivos"("tenant_id", "nro_abonado");
CREATE UNIQUE INDEX IF NOT EXISTS "zonas_tenant_id_dispositivo_id_numero_zona_key" ON "zonas"("tenant_id", "dispositivo_id", "numero_zona");
CREATE UNIQUE INDEX IF NOT EXISTS "incidentes_tenant_id_codigo_key" ON "incidentes"("tenant_id", "codigo");

-- AddForeignKeys
ALTER TABLE "cotizaciones" ADD CONSTRAINT "cotizaciones_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "cotizacion_items" ADD CONSTRAINT "cotizacion_items_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "novedades" ADD CONSTRAINT "novedades_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "puntos_control" ADD CONSTRAINT "puntos_control_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "puntos_control" ADD CONSTRAINT "puntos_control_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_puesto_id_fkey" FOREIGN KEY ("puesto_id") REFERENCES "puestos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rondas" ADD CONSTRAINT "rondas_vigilador_id_fkey" FOREIGN KEY ("vigilador_id") REFERENCES "vigiladores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "umbrales_aprobacion" ADD CONSTRAINT "umbrales_aprobacion_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "solicitudes_compra" ADD CONSTRAINT "solicitudes_compra_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "solicitudes_compra" ADD CONSTRAINT "solicitudes_compra_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ordenes_compra" ADD CONSTRAINT "ordenes_compra_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "solicitudes_compra"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "orden_compra_items" ADD CONSTRAINT "orden_compra_items_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes_compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "zonas" ADD CONSTRAINT "zonas_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_zona_id_fkey" FOREIGN KEY ("zona_id") REFERENCES "zonas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "incidentes" ADD CONSTRAINT "incidentes_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "incidente_bitacora" ADD CONSTRAINT "incidente_bitacora_incidente_id_fkey" FOREIGN KEY ("incidente_id") REFERENCES "incidentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "procedimientos" ADD CONSTRAINT "procedimientos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "contactos_emergencia" ADD CONSTRAINT "contactos_emergencia_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "programaciones_horarias" ADD CONSTRAINT "programaciones_horarias_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "programaciones_horarias" ADD CONSTRAINT "programaciones_horarias_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
