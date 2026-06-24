import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NotificacionesService } from './notificaciones.service';

export const NOTIFICACIONES_QUEUE = 'notificaciones';

/**
 * Worker BullMQ. Procesa los jobs encolados (incluido el repetible diario
 * `escanear-vencimientos`). Requiere Redis corriendo (lo provee docker-compose).
 */
@Processor(NOTIFICACIONES_QUEUE)
export class NotificacionesProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificacionesProcessor.name);

  constructor(private readonly notificaciones: NotificacionesService) {
    super();
  }

  async process(job: Job): Promise<unknown> {
    switch (job.name) {
      case 'escanear-vencimientos': {
        const dias = job.data?.diasUmbral ?? 30;
        const creadas =
          await this.notificaciones.generarAvisosCredencialesPorVencer(dias);
        return { creadas };
      }
      // TODO(M6): 'escanear-vencimientos-flota' (VTV/seguro) cuando exista
      // vehiculo_vencimientos. TODO(rentabilidad): 'erosion-margen'.
      default:
        this.logger.warn(`Job desconocido: ${job.name}`);
        return null;
    }
  }
}
