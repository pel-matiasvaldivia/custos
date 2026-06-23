import { Module } from '@nestjs/common';
import { CentroOperacionesService } from './centro-operaciones.service';
import { CentroOperacionesController } from './centro-operaciones.controller';
import { COGateway } from './gateways/co.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { SiaReceiverService } from './receivers/sia-receiver.service';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CentroOperacionesController, VideoController],
  providers: [
    CentroOperacionesService,
    COGateway,
    SiaReceiverService,
    VideoService,
  ],
  exports: [CentroOperacionesService, COGateway, VideoService],
})
export class CentroOperacionesModule {}
