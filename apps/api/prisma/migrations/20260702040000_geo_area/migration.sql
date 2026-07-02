-- Geoposicionamiento y área de cobertura.
-- Tenant: coordenadas del domicilio de la empresa, para centrar el mapa del
-- Centro de Operaciones ahí (hoy cae en CABA por default).
-- Objetivo: polígono del área que cubre (JSON con lista de {lat,lng}), para
-- que el operador vea el perímetro real en el mapa.

ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "lng" DOUBLE PRECISION;

ALTER TABLE "objetivos" ADD COLUMN IF NOT EXISTS "area_cobertura" JSONB;
