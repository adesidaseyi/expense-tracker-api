import { HttpStatus, Injectable } from '@nestjs/common';
import { MonthQueryDto } from './dto/month-query.dto';
import { ExpensesService } from 'src/expenses/expenses.service';

@Injectable()
export class ReportsService {
  constructor(private expensesService: ExpensesService) {}

  async getMonthlyReport(userId: number, monthQueryDto: MonthQueryDto) {
    try {
      // get all user expenses by some month
      const allExpenses = await this.expensesService.getMonthlyExpenses(
        userId,
        monthQueryDto,
      );

      const totalAmount = allExpenses.reduce(
        (accumulator, currentExpense) => accumulator + currentExpense.amount,
        0,
      );

      const categoriesMap: Map<
        number,
        { categoryId: number; categoryName: string; total: number }
      > = new Map();

      allExpenses.forEach((expense) => {
        const previousValue = categoriesMap.get(expense.category.id);
        if (previousValue !== undefined) {
          categoriesMap.set(expense.category.id, {
            ...previousValue,
            total: previousValue.total + expense.amount,
          });
        } else {
          categoriesMap.set(expense.category.id, {
            categoryId: expense.category.id,
            categoryName: expense.category.name,
            total: expense.amount,
          });
        }
      });

      const categorizedTotal = Array.from(categoriesMap.values());

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved monthly Expense report',
        data: {
          month: monthQueryDto.month,
          total: totalAmount,
          byCategory: categorizedTotal,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
