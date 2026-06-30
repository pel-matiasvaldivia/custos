import { Module } from '@nestjs/common';
import { VigilanteService } from './vigilante.service';
import { VigilanteController } from './vigilante.controller';
import { StorageModule } from '../storage/storage.module';
import { HerramientaModule } from '../herramienta/herramienta.module';

@Module({
  imports: [StorageModule, HerramientaModule],
  providers: [VigilanteService],
  controllers: [VigilanteController],
  exports: [VigilanteService],
})
export class VigilanteModule {}
