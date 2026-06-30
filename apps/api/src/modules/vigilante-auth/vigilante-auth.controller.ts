import { Controller, Post, Body } from '@nestjs/common';
import { VigilanteAuthService } from './vigilante-auth.service';
import { LoginVigiladorDto } from './dto/login-vigilador.dto';

@Controller('mobile/auth')
export class VigilanteAuthController {
  constructor(private readonly vigilanteAuthService: VigilanteAuthService) {}

  @Post('login')
  login(@Body() body: LoginVigiladorDto) {
    return this.vigilanteAuthService.login(body.legajo_nro, body.pin);
  }
}
