import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { NovedadService } from './novedad.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/v1/novedades')
@UseGuards(JwtAuthGuard)
export class NovedadController {
  constructor(private readonly novedadService: NovedadService) {}

  @Post()
  create(@Request() req: any, @Body() data: any) {
    return this.novedadService.create(req.user.tenantId, data);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.novedadService.findAll(req.user.tenantId);
  }

  @Get('puesto/:id')
  findByPuesto(@Request() req: any, @Param('id') id: string) {
    return this.novedadService.findByPuesto(req.user.tenantId, id);
  }
}
