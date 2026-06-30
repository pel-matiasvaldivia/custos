-- Habilita: (1) login móvil de vigiladores por legajo+PIN, (2) registrar el
-- motivo de una solicitud de cambio de turno pendiente sobre el turno
-- planificado original, (3) upsert idempotente de cobertura por puesto.

ALTER TABLE "vigiladores" ADD COLUMN IF NOT EXISTS "pin" TEXT;

ALTER TABLE "turnos_planificados" ADD COLUMN IF NOT EXISTS "motivo" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "puesto_cobertura_tenant_id_puesto_id_key" ON "puesto_cobertura"("tenant_id", "puesto_id");
