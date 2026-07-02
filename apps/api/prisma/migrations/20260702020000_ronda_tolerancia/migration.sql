-- Tolerancia de cumplimiento de la ronda: minutos desde el inicio dentro de los
-- cuales el recorrido debe completarse. Si se vence, el watcher marca la ronda
-- INCOMPLETA y alerta al Centro de Operaciones. NULL = sin límite.

ALTER TABLE "ronda_plantillas" ADD COLUMN IF NOT EXISTS "tolerancia_min" INTEGER;
