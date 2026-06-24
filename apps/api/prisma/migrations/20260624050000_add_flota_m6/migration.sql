-- AlterTable: campos M6 en vehiculos (aditivo)
ALTER TABLE "vehiculos" ADD COLUMN "codigo" TEXT;
ALTER TABLE "vehiculos" ADD COLUMN "tipo" TEXT;
ALTER TABLE "vehiculos" ADD COLUMN "km_actual" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "vehiculos" ADD COLUMN "estado" TEXT NOT NULL DEFAULT 'OPERATIVO';

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "vehiculos_tenant_id_codigo_key" ON "vehiculos"("tenant_id", "codigo");

-- AddForeignKey
ALTER TABLE "vehiculo_vencimientos" ADD CONSTRAINT "vehiculo_vencimientos_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "planes_mantenimiento" ADD CONSTRAINT "planes_mantenimiento_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ot_items" ADD CONSTRAINT "ot_items_orden_trabajo_id_fkey" FOREIGN KEY ("orden_trabajo_id") REFERENCES "ordenes_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargas_combustible" ADD CONSTRAINT "cargas_combustible_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_movil" ADD CONSTRAINT "asignaciones_movil_vehiculo_id_fkey" FOREIGN KEY ("vehiculo_id") REFERENCES "vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
