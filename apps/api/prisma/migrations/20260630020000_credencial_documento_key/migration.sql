-- Guarda la key interna de MinIO en vez de depender de una URL presignada
-- (la URL presignada expira y, además, apunta al hostname interno "minio"
-- que el navegador del usuario no puede resolver).
ALTER TABLE "credenciales" ADD COLUMN "documento_key" TEXT;
