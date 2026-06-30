-- objetivos.cliente_id era UUID NOT NULL sin FK y sin tabla Cliente: ningún
-- código del backend lo usaba, así que hoy es imposible crear un objetivo.
-- Se reemplaza por cliente_nombre, igual que Cotizacion/Contrato, y se agrega
-- estado para poder dar de baja un objetivo sin borrarlo.

ALTER TABLE "objetivos" ADD COLUMN "cliente_nombre" TEXT;
UPDATE "objetivos" SET "cliente_nombre" = '' WHERE "cliente_nombre" IS NULL;
ALTER TABLE "objetivos" ALTER COLUMN "cliente_nombre" SET NOT NULL;
ALTER TABLE "objetivos" DROP COLUMN "cliente_id";

ALTER TABLE "objetivos" ADD COLUMN "estado" TEXT NOT NULL DEFAULT 'ACTIVO';
