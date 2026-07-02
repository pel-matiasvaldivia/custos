-- Rondas programadas: una plantilla define qué puntos de control debe recorrer
-- el personal de turno de un objetivo. Cada ejecución real es una fila en
-- "rondas" (ya existente) vinculada a su plantilla; las marcas de cada punto
-- escaneado quedan en "marcas_ronda" como evidencia.

CREATE TABLE IF NOT EXISTS "ronda_plantillas" (
  "id"          UUID        NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id"   UUID        NOT NULL,
  "objetivo_id" UUID        NOT NULL,
  "nombre"      TEXT        NOT NULL,
  "activa"      BOOLEAN     NOT NULL DEFAULT true,
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "ronda_plantillas_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ronda_plantillas_tenant_id_fkey') THEN
    ALTER TABLE "ronda_plantillas" ADD CONSTRAINT "ronda_plantillas_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ronda_plantillas_objetivo_id_fkey') THEN
    ALTER TABLE "ronda_plantillas" ADD CONSTRAINT "ronda_plantillas_objetivo_id_fkey"
      FOREIGN KEY ("objetivo_id") REFERENCES "objetivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ronda_plantilla_puntos" (
  "id"               UUID NOT NULL DEFAULT gen_random_uuid(),
  "plantilla_id"     UUID NOT NULL,
  "punto_control_id" UUID NOT NULL,
  "orden"            INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ronda_plantilla_puntos_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ronda_plantilla_puntos_plantilla_id_fkey') THEN
    ALTER TABLE "ronda_plantilla_puntos" ADD CONSTRAINT "ronda_plantilla_puntos_plantilla_id_fkey"
      FOREIGN KEY ("plantilla_id") REFERENCES "ronda_plantillas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ronda_plantilla_puntos_punto_control_id_fkey') THEN
    ALTER TABLE "ronda_plantilla_puntos" ADD CONSTRAINT "ronda_plantilla_puntos_punto_control_id_fkey"
      FOREIGN KEY ("punto_control_id") REFERENCES "puntos_control"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "ronda_plantilla_puntos_plantilla_id_punto_control_id_key"
  ON "ronda_plantilla_puntos"("plantilla_id", "punto_control_id");

-- Vincula cada ejecución a la plantilla que la originó (nullable: las rondas
-- ad-hoc previas a esta migración no tienen plantilla).
ALTER TABLE "rondas" ADD COLUMN IF NOT EXISTS "plantilla_id" UUID;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'rondas_plantilla_id_fkey') THEN
    ALTER TABLE "rondas" ADD CONSTRAINT "rondas_plantilla_id_fkey"
      FOREIGN KEY ("plantilla_id") REFERENCES "ronda_plantillas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- Aislamiento por RLS (misma política que el resto de las tablas con tenant_id).
ALTER TABLE "ronda_plantillas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ronda_plantillas" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "ronda_plantillas";
CREATE POLICY tenant_isolation ON "ronda_plantillas"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);
