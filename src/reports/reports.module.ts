import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ExpensesModule } from 'src/expenses/expenses.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true, ttl: 60000 }),
    ExpensesModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
