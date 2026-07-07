-- Integración Hikvision + video verificación (F1–F4).
-- Agrega: token de ingesta global por dispositivo, canales de video de DVR/NVR,
-- mapeo zona→canal, y campos de canal/snapshot en eventos.

-- 1. Dispositivo: token único global para el push del Alarm Server.
ALTER TABLE "dispositivos" ADD COLUMN IF NOT EXISTS "ingest_token" TEXT;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dispositivos_ingest_token_key') THEN
    ALTER TABLE "dispositivos"
      ADD CONSTRAINT "dispositivos_ingest_token_key" UNIQUE ("ingest_token");
  END IF;
END $$;

-- 2. Canales de video (cámaras de un DVR/NVR, o el único canal de una cámara IP).
CREATE TABLE IF NOT EXISTS "dispositivo_canales" (
    "id"             UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id"      UUID NOT NULL,
    "dispositivo_id" UUID NOT NULL,
    "numero_canal"   INTEGER NOT NULL,
    "nombre"         TEXT,
    "rtsp_path"      TEXT,
    "tiene_ptz"      BOOLEAN NOT NULL DEFAULT false,
    "habilitado"     BOOLEAN NOT NULL DEFAULT true,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT "dispositivo_canales_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dispositivo_canales_tenant_id_fkey') THEN
    ALTER TABLE "dispositivo_canales"
      ADD CONSTRAINT "dispositivo_canales_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'dispositivo_canales_dispositivo_id_fkey') THEN
    ALTER TABLE "dispositivo_canales"
      ADD CONSTRAINT "dispositivo_canales_dispositivo_id_fkey"
      FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'dispositivo_canales_tenant_id_dispositivo_id_numero_canal_key'
  ) THEN
    ALTER TABLE "dispositivo_canales"
      ADD CONSTRAINT "dispositivo_canales_tenant_id_dispositivo_id_numero_canal_key"
      UNIQUE ("tenant_id", "dispositivo_id", "numero_canal");
  END IF;
END $$;

ALTER TABLE "dispositivo_canales" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "dispositivo_canales" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "dispositivo_canales";
CREATE POLICY tenant_isolation ON "dispositivo_canales"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);

-- 3. Zona: mapeo al canal de video que la verifica.
ALTER TABLE "zonas" ADD COLUMN IF NOT EXISTS "canal_id" UUID;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'zonas_canal_id_fkey') THEN
    ALTER TABLE "zonas"
      ADD CONSTRAINT "zonas_canal_id_fkey"
      FOREIGN KEY ("canal_id") REFERENCES "dispositivo_canales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

-- 4. Evento: canal nativo de video y snapshot del instante del disparo.
ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "canal_numero" INTEGER;
ALTER TABLE "eventos" ADD COLUMN IF NOT EXISTS "snapshot_key" TEXT;
