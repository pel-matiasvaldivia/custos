import { Module } from '@nestjs/common';
import { CostosService } from './costos.service';
import { CostosController } from './costos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CostosController],
  providers: [CostosService],
  exports: [CostosService],
})
export class CostosModule {}
