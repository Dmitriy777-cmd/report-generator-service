import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Report } from './report.entity';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('create')
  async createReport(
    @Body() body: { serviceName: string; endpoint: string; headers: string },
  ): Promise<Report> {
    return this.reportsService.createReport(
      body.serviceName,
      body.endpoint,
      body.headers,
    );
  }

  @Get(':id')
  async getReport(@Param('id') id: number): Promise<Report> {
    return this.reportsService.findReportById(id);
  }
}
