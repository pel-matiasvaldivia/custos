import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto, ResetPasswordDto } from './dto/update-usuario.dto';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly svc: UsuariosService) {}

  @Get()
  @Roles('ADMIN', 'GERENCIA')
  listar(@Request() req: any) {
    return this.svc.listar(req.user.tenantId);
  }

  @Post()
  @Roles('ADMIN')
  crear(@Request() req: any, @Body() dto: CreateUsuarioDto) {
    return this.svc.crear(req.user.tenantId, req.user.userId, dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  actualizar(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.svc.actualizar(req.user.tenantId, id, dto);
  }

  @Post(':id/reset-password')
  @Roles('ADMIN')
  resetPassword(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.svc.resetPassword(req.user.tenantId, req.user.userId, id, dto.password);
  }

  @Delete(':id')
  @Roles('ADMIN')
  eliminar(
    @Request() req: any,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.svc.eliminar(req.user.tenantId, req.user.userId, id);
  }
}
