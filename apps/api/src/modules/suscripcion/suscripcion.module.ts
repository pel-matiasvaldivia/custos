import { Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
})
export class SuscripcionModule {}
