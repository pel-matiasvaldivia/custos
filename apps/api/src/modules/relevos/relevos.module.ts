import { Module } from '@nestjs/common';
import { RelevosService } from './relevos.service';
import { RelevosController } from './relevos.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { CentroOperacionesModule } from '../centro-operaciones/centro-operaciones.module';

@Module({
  imports: [PrismaModule, CentroOperacionesModule],
  controllers: [RelevosController],
  providers: [RelevosService],
  exports: [RelevosService],
})
export class RelevosModule {}
