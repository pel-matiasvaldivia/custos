import { Module } from '@nestjs/common';
import { CredencialService } from './credencial.service';
import { CredencialController } from './credencial.controller';
import { StorageModule } from '../storage/storage.module';
import { VigilanteModule } from '../vigilante/vigilante.module';

@Module({
  imports: [StorageModule, VigilanteModule],
  controllers: [CredencialController],
  providers: [CredencialService],
  exports: [CredencialService],
})
export class CredencialModule {}
