-- Add trial & subscription fields to tenants
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "plan"           TEXT        NOT NULL DEFAULT 'TRIAL';
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "trial_hasta"    TIMESTAMPTZ;
ALTER TABLE "tenants" ADD COLUMN IF NOT EXISTS "suscripcion_id" TEXT;

-- Set trial_hasta = created_at + 30 days for existing tenants that are in TRIAL
UPDATE "tenants" SET "trial_hasta" = "created_at" + INTERVAL '30 days' WHERE "trial_hasta" IS NULL;
