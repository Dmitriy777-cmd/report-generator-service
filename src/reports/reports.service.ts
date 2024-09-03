import { Injectable } from '@nestjs/common';
import { Report } from './report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async createReport(
    serviceName: string,
    endpoint: string,
    headers: string,
  ): Promise<Report> {
    const report = this.reportsRepository.create({
      serviceName,
      endpoint,
      headers,
    });
    await this.reportsRepository.save(report);
    this.generateReport(report); // Запускаем генерацию отчета
    return report;
  }

  private async generateReport(report: Report) {
    try {
      const response = await axios.get(report.endpoint);
      const worksheet = XLSX.utils.json_to_sheet(response.data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, 'Report');
      const filePath = join(
        __dirname,
        '..',
        '..',
        'reports',
        `${report.id}.xlsx`,
      );
      writeFileSync(
        filePath,
        XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }),
      );
      report.status = 'completed';
      report.fileUrl = filePath;
      await this.reportsRepository.save(report); // Обновляем статус и ссылку на файл
    } catch (error) {
      console.error('Error generating report:', error);
      report.status = 'failed';
      await this.reportsRepository.save(report);
    }
  }

  async findReportById(id: number): Promise<Report | undefined> {
    return this.reportsRepository.findOne({ where: { id } });
  }
}
