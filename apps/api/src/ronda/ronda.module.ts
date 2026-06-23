import { Module } from '@nestjs/common';
import { RondaService } from './ronda.service';
import { RondaController } from './ronda.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RondaController],
  providers: [RondaService],
  exports: [RondaService],
})
export class RondaModule {}
