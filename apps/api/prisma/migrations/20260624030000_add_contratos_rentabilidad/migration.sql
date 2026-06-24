-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateIndex
CREATE UNIQUE INDEX "contratos_tenant_id_codigo_key" ON "contratos"("tenant_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "contrato_facturacion_contrato_id_key" ON "contrato_facturacion"("contrato_id");

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_objetivo_id_fkey" FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_cotizacion_id_fkey" FOREIGN KEY ("cotizacion_id") REFERENCES "cotizaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato_facturacion" ADD CONSTRAINT "contrato_facturacion_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato_facturacion" ADD CONSTRAINT "contrato_facturacion_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periodos" ADD CONSTRAINT "periodos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_periodo_id_fkey" FOREIGN KEY ("periodo_id") REFERENCES "periodos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliacion_hh" ADD CONSTRAINT "conciliacion_hh_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
