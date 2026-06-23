import { Module } from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { NovedadController } from './novedad.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NovedadController],
  providers: [NovedadService],
  exports: [NovedadService],
})
export class NovedadModule {}
