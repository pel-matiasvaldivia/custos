import { Controller, Post, Body } from '@nestjs/common';
import { VigilanteAuthService } from './vigilante-auth.service';
import { LoginVigiladorDto } from './dto/login-vigilador.dto';
import { LoginDispositivoDto } from './dto/login-dispositivo.dto';

@Controller('mobile/auth')
export class VigilanteAuthController {
  constructor(private readonly vigilanteAuthService: VigilanteAuthService) {}

  @Post('login')
  login(@Body() body: LoginVigiladorDto) {
    return this.vigilanteAuthService.login(body.legajo_nro, body.pin);
  }

  /** Login del dispositivo compartido de un objetivo (TAG NFC o ID + PIN). */
  @Post('device')
  loginDispositivo(@Body() body: LoginDispositivoDto) {
    return this.vigilanteAuthService.loginDispositivo(body);
  }
}
