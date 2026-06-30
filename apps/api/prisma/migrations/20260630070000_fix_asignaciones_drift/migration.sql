-- Corrige el drift entre schema.prisma y la tabla `asignaciones` tal como
-- quedó creada en 20260624000000_full_schema_rescue.
--
-- Esa migración creó asignaciones con inicio_plan/fin_plan (timestamptz) y
-- vigilador_id NOT NULL. El modelo Asignacion (y todo el módulo de Cuadrante
-- + ObjetivoService.findDetalle) esperan fecha (date) + hora_inicio/hora_fin
-- (text) y vigilador_id opcional. Nunca se escribió una migración para
-- reconciliar ambos, así que en producción cualquier consulta a
-- asignaciones.fecha falla con "column does not exist".
--
-- Esta migración agrega las columnas nuevas, migra los datos existentes de
-- inicio_plan/fin_plan, y luego elimina las columnas viejas. Es segura de
-- reaplicar (todos los pasos son idempotentes) y conserva los datos.

ALTER TABLE asignaciones ALTER COLUMN vigilador_id DROP NOT NULL;

ALTER TABLE asignaciones ADD COLUMN IF NOT EXISTS fecha DATE;
ALTER TABLE asignaciones ADD COLUMN IF NOT EXISTS hora_inicio TEXT;
ALTER TABLE asignaciones ADD COLUMN IF NOT EXISTS hora_fin TEXT;

UPDATE asignaciones
SET fecha = inicio_plan::date,
    hora_inicio = to_char(inicio_plan, 'HH24:MI'),
    hora_fin = to_char(fin_plan, 'HH24:MI')
WHERE fecha IS NULL
  AND inicio_plan IS NOT NULL
  AND fin_plan IS NOT NULL;

ALTER TABLE asignaciones ALTER COLUMN fecha SET NOT NULL;
ALTER TABLE asignaciones ALTER COLUMN hora_inicio SET NOT NULL;
ALTER TABLE asignaciones ALTER COLUMN hora_fin SET NOT NULL;

ALTER TABLE asignaciones DROP COLUMN IF EXISTS inicio_plan;
ALTER TABLE asignaciones DROP COLUMN IF EXISTS fin_plan;

DROP INDEX IF EXISTS "asignaciones_puesto_id_fecha_hora_inicio_key";
CREATE UNIQUE INDEX IF NOT EXISTS "asignaciones_puesto_id_fecha_hora_inicio_key"
  ON asignaciones (puesto_id, fecha, hora_inicio);
