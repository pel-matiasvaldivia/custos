-- Costo por hora del vehículo, para estimar el costo de operación al
-- asignarlo a un objetivo en función de las horas de cobertura contratadas.
ALTER TABLE "vehiculos" ADD COLUMN "costo_hora" DECIMAL(10,2);

-- Estimación guardada en el momento de la asignación, para no recalcular
-- con datos que pueden cambiar después (ej: si se edita el esquema horario).
ALTER TABLE "asignaciones_movil" ADD COLUMN "horas_estimadas_mes" DOUBLE PRECISION;
ALTER TABLE "asignaciones_movil" ADD COLUMN "costo_estimado_mensual" DECIMAL(14,2);
