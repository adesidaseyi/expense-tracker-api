import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { MonthQueryDto } from './dto/month-query.dto';
import { ActiveUser } from 'src/iam/authentication/active-user.decorator';
import { ReportsService } from './reports.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('reports')
@UseInterceptors(CacheInterceptor)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  getMonthlyReport(
    @ActiveUser('sub') userId: number,
    @Query() monthQueryDto: MonthQueryDto,
  ) {
    return this.reportsService.getMonthlyReport(userId, monthQueryDto);
  }
}
