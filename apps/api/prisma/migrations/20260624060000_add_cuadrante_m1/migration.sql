-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
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

-- CreateTable
CREATE TABLE "relevos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "turno_original_id" UUID NOT NULL,
    "turno_relevo_id" UUID NOT NULL,
    "motivo" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relevos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "puesto_cobertura" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "puesto_id" UUID NOT NULL,
    "dotacion_requerida" INTEGER NOT NULL DEFAULT 1,
    "ventana" JSONB NOT NULL,

    CONSTRAINT "puesto_cobertura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reglas_laborales_tenant_id_key" ON "reglas_laborales"("tenant_id");

-- CreateIndex
CREATE INDEX "turnos_planificados_tenant_id_vigilador_id_inicio_plan_idx" ON "turnos_planificados"("tenant_id", "vigilador_id", "inicio_plan");

-- CreateIndex
CREATE INDEX "turnos_planificados_tenant_id_puesto_id_inicio_plan_idx" ON "turnos_planificados"("tenant_id", "puesto_id", "inicio_plan");

-- AddForeignKey
ALTER TABLE "reglas_laborales" ADD CONSTRAINT "reglas_laborales_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esquemas_turno" ADD CONSTRAINT "esquemas_turno_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_esquema" ADD CONSTRAINT "asignaciones_esquema_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_esquema" ADD CONSTRAINT "asignaciones_esquema_esquema_id_fkey" FOREIGN KEY ("esquema_id") REFERENCES "esquemas_turno"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos_planificados" ADD CONSTRAINT "turnos_planificados_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turnos_planificados" ADD CONSTRAINT "turnos_planificados_asignacion_esquema_id_fkey" FOREIGN KEY ("asignacion_esquema_id") REFERENCES "asignaciones_esquema"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relevos" ADD CONSTRAINT "relevos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puesto_cobertura" ADD CONSTRAINT "puesto_cobertura_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
