import { Module } from '@nestjs/common';
import { ContratoConfigService } from './contrato-config.service';
import { ContratoConfigController } from './contrato-config.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [ContratoConfigController],
  providers: [ContratoConfigService],
  exports: [ContratoConfigService],
})
export class ContratoConfigModule {}
