import { Controller, Get, Body, Put, UseGuards, Request } from '@nestjs/common';
import { CostosService } from './costos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateCostosDto } from './dto/update-costos.dto';

@Controller('config/costos')
@UseGuards(JwtAuthGuard)
export class CostosController {
  constructor(private readonly costosService: CostosService) {}

  @Get()
  findOne(@Request() req: any) {
    return this.costosService.findOne(req.user.tenantId);
  }

  @Put()
  update(@Request() req: any, @Body() data: UpdateCostosDto) {
    return this.costosService.update(req.user.tenantId, data);
  }
}
