import { Module } from '@nestjs/common';
import { VigilanteService } from './vigilante.service';
import { VigilanteController } from './vigilante.controller';

@Module({
  providers: [VigilanteService],
  controllers: [VigilanteController],
  exports: [VigilanteService],
})
export class VigilanteModule {}
