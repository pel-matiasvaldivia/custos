import { Module } from '@nestjs/common';
import { FlotaService } from './flota.service';

@Module({
  providers: [FlotaService],
  exports: [FlotaService],
})
export class FlotaModule {}
