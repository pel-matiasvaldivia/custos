import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CatalogoService } from './catalogo.service';
import { CreateCatalogoItemDto } from './dto/create-catalogo-item.dto';

@Controller('catalogos')
@UseGuards(JwtAuthGuard)
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Get(':categoria')
  async findAll(@Param('categoria') categoria: string, @Request() req: any) {
    return this.catalogoService.findAll(req.user.tenantId, categoria);
  }

  @Post(':categoria')
  async create(
    @Param('categoria') categoria: string,
    @Body() body: CreateCatalogoItemDto,
    @Request() req: any,
  ) {
    return this.catalogoService.create(req.user.tenantId, categoria, body.etiqueta);
  }

  @Delete(':categoria/:id')
  async remove(
    @Param('categoria') categoria: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.catalogoService.remove(req.user.tenantId, categoria, id);
  }
}
