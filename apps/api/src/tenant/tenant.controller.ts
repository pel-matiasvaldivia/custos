import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('system/tenants')
@UseGuards(JwtAuthGuard)
// In a real app, I'd add a @Roles('SUPERADMIN') guard here
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Get()
  findAll() {
    return this.tenantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantService.findOne(id);
  }

  @Post()
  create(@Body() data: Prisma.TenantCreateInput) {
    return this.tenantService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Prisma.TenantUpdateInput) {
    return this.tenantService.update(id, data);
  }
}
