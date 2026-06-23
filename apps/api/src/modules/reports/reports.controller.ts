import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Response } from 'express';

@Controller('centro-operaciones/informes')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('incidentes/pdf')
  async downloadIncidentPdf(
    @Query() query: any,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const doc = await this.reportsService.generateIncidentPdf(
      req.user.tenantId,
      query,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-incidentes.pdf',
    );

    doc.pipe(res);
    doc.end();
  }

  @Get('incidentes/excel')
  async downloadIncidentExcel(
    @Query() query: any,
    @Request() req: any,
    @Res() res: Response,
  ) {
    const workbook = await this.reportsService.generateIncidentExcel(
      req.user.tenantId,
      query,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=reporte-incidentes.xlsx',
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
