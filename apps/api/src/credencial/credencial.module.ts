import { Module } from '@nestjs/common';
import { CredencialService } from './credencial.service';
import { CredencialController } from './credencial.controller';
import { CredencialAlertasController } from './credencial-alertas.controller';
import { StorageModule } from '../storage/storage.module';
import { VigilanteModule } from '../vigilante/vigilante.module';

@Module({
  imports: [StorageModule, VigilanteModule],
  controllers: [CredencialController, CredencialAlertasController],
  providers: [CredencialService],
  exports: [CredencialService],
})
export class CredencialModule {}
