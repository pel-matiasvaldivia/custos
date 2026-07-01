import { Module } from '@nestjs/common';
import { LiquidacionesService } from './liquidaciones.service';
import { LiquidacionesController } from './liquidaciones.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LiquidacionesController],
  providers: [LiquidacionesService],
  exports: [LiquidacionesService],
})
export class LiquidacionesModule {}
