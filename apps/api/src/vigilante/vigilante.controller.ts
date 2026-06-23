import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VigilanteService } from './vigilante.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // I need to create this guard

@Controller('vigilantes')
@UseGuards(JwtAuthGuard)
export class VigilanteController {
  constructor(private readonly vigilanteService: VigilanteService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.vigilanteService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.vigilanteService.findOne(id, req.user.tenantId);
  }

  @Post()
  async create(@Body() body: any, @Request() req: any) {
    return this.vigilanteService.create({
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
    return this.vigilanteService.update(id, req.user.tenantId, body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: any) {
    return this.vigilanteService.delete(id, req.user.tenantId);
  }
}
