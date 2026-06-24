import { Module } from '@nestjs/common';
import { RentabilidadService } from './rentabilidad.service';
import { RentabilidadController } from './rentabilidad.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RentabilidadController],
  providers: [RentabilidadService],
  exports: [RentabilidadService],
})
export class RentabilidadModule {}
