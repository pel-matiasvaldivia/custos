import { Module } from '@nestjs/common';
import { CredencialService } from './credencial.service';

@Module({
  providers: [CredencialService],
  exports: [CredencialService],
})
export class CredencialModule {}
