import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ImpersonateDto } from './dto/impersonate.dto';
import { RegistroDto } from './dto/registro.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return this.authService.login(user);
  }

  /** Endpoint público: registro self-service de nueva empresa. */
  @Post('registro')
  registro(@Body() body: RegistroDto) {
    return this.authService.registro(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get('tenants')
  async listTenants() {
    return this.authService.listTenants();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post('impersonate')
  async impersonate(@Request() req: any, @Body() body: ImpersonateDto) {
    return this.authService.impersonate(req.user, body.tenant_id);
  }
}
