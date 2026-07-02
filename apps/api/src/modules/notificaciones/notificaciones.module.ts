import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { BullModule, InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NotificacionesService } from './notificaciones.service';
import {
  NotificacionesProcessor,
  NOTIFICACIONES_QUEUE,
} from './notificaciones.processor';
import { RondaModule } from '../../ronda/ronda.module';

/**
 * Notificaciones (worker BullMQ). La conexión a Redis se toma de env
 * (REDIS_HOST/REDIS_PORT), coherente con docker-compose.
 */
@Module({
  imports: [
    BullModule.forRoot({
      connection: process.env.REDIS_URL
        ? {
            url: process.env.REDIS_URL,
          }
        : {
            host: process.env.REDIS_HOST || 'redis',
            port: Number(process.env.REDIS_PORT || 6379),
          },
    }),
    BullModule.registerQueue({ name: NOTIFICACIONES_QUEUE }),
    RondaModule,
  ],
  providers: [NotificacionesService, NotificacionesProcessor],
  exports: [NotificacionesService],
})
export class NotificacionesModule implements OnModuleInit {
  private readonly logger = new Logger(NotificacionesModule.name);

  constructor(
    @InjectQueue(NOTIFICACIONES_QUEUE) private readonly queue: Queue,
  ) {}

  // Programa los jobs repetibles idempotentes (escaneo de vencimientos y
  // vigilancia de rondas en progreso).
  async onModuleInit() {
    try {
      await this.queue.add(
        'escanear-vencimientos',
        { diasUmbral: 30 },
        {
          repeat: { pattern: '0 7 * * *' }, // 07:00 todos los días
          jobId: 'escaneo-vencimientos-diario',
          removeOnComplete: true,
          removeOnFail: 100,
        },
      );
      await this.queue.add(
        'vigilar-rondas',
        {},
        {
          repeat: { pattern: '* * * * *' }, // cada minuto (tolerancia se mide en minutos)
          jobId: 'vigilancia-rondas',
          removeOnComplete: true,
          removeOnFail: 20,
        },
      );
    } catch (e) {
      this.logger.warn(
        `No se pudieron programar los jobs repetibles (¿Redis arriba?): ${e}`,
      );
    }
  }
}
