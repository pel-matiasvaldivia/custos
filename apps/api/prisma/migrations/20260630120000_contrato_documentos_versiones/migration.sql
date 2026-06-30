-- AlterTable: add BORRADOR as valid initial state (existing rows stay ACTIVO)
-- No DDL change needed for estado itself (it's a String).

-- CreateTable: version history for contract documents
CREATE TABLE "contrato_documentos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenant_id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "documento_key" TEXT NOT NULL,
    "generado_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT,

    CONSTRAINT "contrato_documentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contrato_documentos_contrato_id_version_key" ON "contrato_documentos"("contrato_id", "version");

-- AddForeignKey
ALTER TABLE "contrato_documentos" ADD CONSTRAINT "contrato_documentos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contrato_documentos" ADD CONSTRAINT "contrato_documentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
