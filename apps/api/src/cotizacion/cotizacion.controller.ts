import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CotizacionService } from './cotizacion.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/cotizaciones')
@UseGuards(JwtAuthGuard)
export class CotizacionController {
  constructor(private readonly cotizacionService: CotizacionService) {}

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.cotizacionService.create(req.user.tenantId, data);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.cotizacionService.findAll(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.cotizacionService.findOne(id, req.user.tenantId);
  }
}
