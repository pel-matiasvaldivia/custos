-- Punto 1: el tenant elige si paga el recargo por feriado trabajado.
-- Punto 4: el tenant elige si habilita la solicitud de adelanto desde el móvil.
ALTER TABLE "reglas_laborales"
  ADD COLUMN "pagar_recargo_feriado" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "adelanto_movil_habilitado" BOOLEAN NOT NULL DEFAULT false;

-- Horas de feriado trabajadas por legajo en la liquidación cerrada.
ALTER TABLE "liquidacion_items"
  ADD COLUMN "hh_feriado" DECIMAL(8,2) NOT NULL DEFAULT 0;
