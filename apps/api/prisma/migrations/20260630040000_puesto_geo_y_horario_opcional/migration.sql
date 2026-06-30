-- esquema_horario quedó NOT NULL sin default desde la migración original,
-- pero el formulario de alta de puesto nunca lo completa: toda creación de
-- puesto fallaba con un 500 sin mensaje claro. Se vuelve opcional, como ya
-- lo declara el schema de Prisma.
ALTER TABLE "puestos" ALTER COLUMN "esquema_horario" DROP NOT NULL;

-- Geoposición del puesto para ubicarlo en el mapa en vivo.
ALTER TABLE "puestos" ADD COLUMN "lat" DOUBLE PRECISION;
ALTER TABLE "puestos" ADD COLUMN "lng" DOUBLE PRECISION;

-- El nombre de puesto debe ser único por objetivo, no por todo el tenant.
CREATE UNIQUE INDEX "puestos_tenant_id_objetivo_id_nombre_key" ON "puestos"("tenant_id", "objetivo_id", "nombre");
