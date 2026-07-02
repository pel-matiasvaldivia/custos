-- Idempotencia de la app móvil offline: registra los client_event_id ya
-- procesados para no reaplicar una acción reintentada al recuperar señal.

CREATE TABLE IF NOT EXISTS "mobile_eventos" (
  "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
  "tenant_id"       UUID        NOT NULL,
  "vigilador_id"    UUID        NOT NULL,
  "client_event_id" TEXT        NOT NULL,
  "tipo"            TEXT        NOT NULL,
  "ts"              TIMESTAMPTZ,
  "procesado_at"    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "mobile_eventos_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'mobile_eventos_tenant_id_fkey') THEN
    ALTER TABLE "mobile_eventos" ADD CONSTRAINT "mobile_eventos_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "mobile_eventos_tenant_id_client_event_id_key"
  ON "mobile_eventos"("tenant_id", "client_event_id");

-- Aislamiento por RLS (misma política que el resto de las tablas con tenant_id).
ALTER TABLE "mobile_eventos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "mobile_eventos" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "mobile_eventos";
CREATE POLICY tenant_isolation ON "mobile_eventos"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);
