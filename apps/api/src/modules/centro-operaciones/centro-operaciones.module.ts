import { Module } from '@nestjs/common';
import { CentroOperacionesService } from './centro-operaciones.service';
import { CentroOperacionesController } from './centro-operaciones.controller';
import { COGateway } from './gateways/co.gateway';
import { PrismaModule } from '../../prisma/prisma.module';
import { StorageModule } from '../../storage/storage.module';
import { SiaReceiverService } from './receivers/sia-receiver.service';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { HikvisionService } from './hikvision/hikvision.service';
import { HikController } from './hikvision/hik.controller';
import { SecretosService } from '../../common/crypto/secretos.service';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [CentroOperacionesController, VideoController, HikController],
  providers: [
    CentroOperacionesService,
    COGateway,
    SiaReceiverService,
    VideoService,
    HikvisionService,
    SecretosService,
  ],
  exports: [CentroOperacionesService, COGateway, VideoService],
})
export class CentroOperacionesModule {}
