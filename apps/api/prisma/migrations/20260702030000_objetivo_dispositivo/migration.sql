-- Modo "un celular por objetivo": el dispositivo se autentica contra el OBJETIVO
-- (no contra un vigilador). Los guardias asignados no inician sesión: se
-- identifican por acción. El dispositivo se vincula por TAG NFC del objetivo o,
-- si no hay tag, por ID de objetivo + PIN.

ALTER TABLE "objetivos" ADD COLUMN IF NOT EXISTS "dispositivo_pin" TEXT;
ALTER TABLE "objetivos" ADD COLUMN IF NOT EXISTS "nfc_tag_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "objetivos_nfc_tag_id_key"
  ON "objetivos"("nfc_tag_id")
  WHERE "nfc_tag_id" IS NOT NULL;
