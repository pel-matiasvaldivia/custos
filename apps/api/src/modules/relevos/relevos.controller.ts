import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RelevosService } from './relevos.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AprobarRelevoDto } from './dto/aprobar-relevo.dto';

@Controller('relevos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'GERENCIA', 'SUPERVISOR')
export class RelevosController {
  constructor(private readonly relevosService: RelevosService) {}

  @Get('pendientes')
  pendientes(@Request() req: any) {
    return this.relevosService.pendientes(req.user.tenantId);
  }

  @Get(':turnoId/candidatos')
  candidatos(@Request() req: any, @Param('turnoId') turnoId: string) {
    return this.relevosService.sugerirCandidatos(req.user.tenantId, turnoId);
  }

  @Post(':turnoId/aprobar')
  aprobar(
    @Request() req: any,
    @Param('turnoId') turnoId: string,
    @Body() dto: AprobarRelevoDto,
  ) {
    return this.relevosService.aprobar(
      req.user.tenantId,
      req.user.userId,
      turnoId,
      dto,
    );
  }

  @Post(':turnoId/rechazar')
  rechazar(@Request() req: any, @Param('turnoId') turnoId: string) {
    return this.relevosService.rechazar(req.user.tenantId, turnoId);
  }
}
