import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { VigilanteAuthService } from './vigilante-auth.service';
import { VigilanteAuthController } from './vigilante-auth.controller';
import { VigiladorJwtStrategy } from './vigilador-jwt.strategy';
import { getJwtSecret } from '../../common/config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: getJwtSecret(),
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [VigilanteAuthService, VigiladorJwtStrategy],
  controllers: [VigilanteAuthController],
  exports: [VigilanteAuthService],
})
export class VigilanteAuthModule {}
