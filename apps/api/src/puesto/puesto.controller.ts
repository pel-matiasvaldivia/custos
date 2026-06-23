import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PuestoService } from './puesto.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('puestos')
@UseGuards(JwtAuthGuard)
export class PuestoController {
  constructor(private readonly puestoService: PuestoService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.puestoService.findAll(req.user.tenantId);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.puestoService.create({
      ...body,
      tenant_id: req.user.tenantId,
    });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Request() req: any,
  ) {
    return this.puestoService.update(id, req.user.tenantId, body);
  }
}
