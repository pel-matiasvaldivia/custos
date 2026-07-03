-- Contador atómico de códigos de incidente por (tenant, año).
-- Evita la race condition de count()+1: el correlativo se toma con un upsert
-- atómico (INSERT ... ON CONFLICT DO UPDATE SET valor = valor + 1). La clave
-- incluye el año, así el correlativo reinicia en 0001 cada año.
CREATE TABLE IF NOT EXISTS "incidente_contador" (
    "tenant_id" UUID NOT NULL,
    "anio"      INTEGER NOT NULL,
    "valor"     INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "incidente_contador_pkey" PRIMARY KEY ("tenant_id","anio")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'incidente_contador_tenant_id_fkey') THEN
    ALTER TABLE "incidente_contador"
      ADD CONSTRAINT "incidente_contador_tenant_id_fkey"
      FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

-- Aislamiento por tenant (mismo patrón que el resto de tablas con tenant_id).
ALTER TABLE "incidente_contador" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "incidente_contador" FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation ON "incidente_contador";
CREATE POLICY tenant_isolation ON "incidente_contador"
  USING (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid)
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant', TRUE), '')::uuid);
