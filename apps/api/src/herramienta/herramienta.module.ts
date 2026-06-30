import { Module } from '@nestjs/common';
import { HerramientaService } from './herramienta.service';
import { HerramientaController } from './herramienta.controller';

@Module({
  controllers: [HerramientaController],
  providers: [HerramientaService],
  exports: [HerramientaService],
})
export class HerramientaModule {}
