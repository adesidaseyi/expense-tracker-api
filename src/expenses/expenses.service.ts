import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { NewExpenseDto } from './dto/new-expense.dto';
import { QueryDto } from './dto/query.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UserService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { IResponse } from 'src/response.interface';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly usersService: UserService,
    private readonly categoriesService: CategoriesService,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  async newExpense(
    userId: number,
    newExpenseDto: NewExpenseDto,
  ): Promise<IResponse> {
    try {
      const { categoryId, ...restOfNewExpenseDto } = newExpenseDto;
      const foundUser = await this.usersService.findUserId(userId);
      const foundCat = await this.categoriesService.findCategoryById(
        userId,
        categoryId,
      );
      const { user, ...restOfNewExpense } = await this.expenseRepository.save({
        ...restOfNewExpenseDto,
        category: foundCat,
        user: foundUser,
      });
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Successfuly created expense',
        data: restOfNewExpense,
      };
    } catch (err) {
      throw err;
    }
  }

  async getAllExpenses(userId: number, queryDto: QueryDto): Promise<IResponse> {
    try {
      const { limit, page, order_spent_at, order_amount } = queryDto;
      const expenses = await this.expenseRepository.find({
        where: { user: { id: userId } },
        relations: { category: true },
        skip: page,
        take: limit,
        order: { spentAt: order_spent_at, amount: order_amount },
      });
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved all expenses',
        data: expenses,
      };
    } catch (err) {
      throw err;
    }
  }

  async getExpense(userId: number, expenseId: number): Promise<IResponse> {
    try {
      const expense = await this.expenseRepository.findOne({
        where: { id: expenseId, user: { id: userId } },
        relations: { category: true },
      });
      if (!expense) {
        throw new NotFoundException('Expense not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully retrieved expense',
        data: expense,
      };
    } catch (err) {
      throw err;
    }
  }

  async updateExpense(
    userId: number,
    expenseId: number,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<IResponse> {
    try {
      const expense: Expense = (await this.getExpense(userId, expenseId)).data;
      for (const key in updateExpenseDto) {
        if (updateExpenseDto[key] !== undefined) {
          expense[key] = updateExpenseDto[key];
        }
      }
      const updatedExpense = await this.expenseRepository.save(expense);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully updated expense',
        data: updatedExpense,
      };
    } catch (err) {
      throw err;
    }
  }

  async deleteExpense(userId: number, expenseId: number): Promise<IResponse> {
    try {
      const expense: Expense = (await this.getExpense(userId, expenseId)).data;
      const deletedExpense = await this.expenseRepository.remove(expense);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully deleted expense',
        data: deletedExpense,
      };
    } catch (err) {
      throw err;
    }
  }

  async uploadReceipt(
    userId: number,
    expenseId: number,
    receiptFile: Express.Multer.File,
  ): Promise<IResponse> {
    try {
      //process userId, save receipt to folder (or does it work the other way around?), and save its url (path) to db
      const expense: Expense = (await this.getExpense(userId, expenseId)).data;
      expense.receiptUrl = receiptFile.path;
      await this.expenseRepository.save(expense);
      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully uploaded receipt',
        data: {
          receipt_url: receiptFile.path,
        },
      };
    } catch (err) {
      throw err;
    }
  }
}
