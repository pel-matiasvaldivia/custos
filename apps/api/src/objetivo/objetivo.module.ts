import { Module } from '@nestjs/common';
import { ObjetivoController } from './objetivo.controller';
import { ObjetivoService } from './objetivo.service';

@Module({
  providers: [ObjetivoService],
  controllers: [ObjetivoController],
  exports: [ObjetivoService],
})
export class ObjetivoModule {}
