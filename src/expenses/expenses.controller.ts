import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import { ActiveUser } from 'src/iam/authentication/active-user.decorator';
import { NewExpenseDto } from './dto/new-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { QueryDto } from './dto/query.dto';
import { Roles } from 'src/iam/authorization/roles.decorator';
import { Role } from 'src/users/enums/roles.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file-uploads.dto';

@ApiBearerAuth()
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  newExpense(
    @ActiveUser('sub') userId: number,
    @Body() newExpenseDto: NewExpenseDto,
  ) {
    return this.expensesService.newExpense(userId, newExpenseDto);
  }

  @Get()
  getAllExpenses(
    @ActiveUser('sub') userId: number,
    @Query() queryDto: QueryDto,
  ) {
    return this.expensesService.getAllExpenses(userId, queryDto);
  }

  @Get(':id')
  getExpense(
    @ActiveUser('sub') userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expensesService.getExpense(userId, expenseId);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Patch(':id')
  updateExpense(
    @ActiveUser('sub') userId: number,
    @Param('id') expenseId: number,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.updateExpense(
      userId,
      expenseId,
      updateExpenseDto,
    );
  }

  @Roles(Role.ADMIN, Role.USER)
  @Delete(':id')
  deleteExpense(
    @ActiveUser('sub') userId: number,
    @Param('id') expenseId: number,
  ) {
    return this.expensesService.deleteExpense(userId, expenseId);
  }

  @Post(':id/receipts')
  @UseInterceptors(FileInterceptor('receipt', { dest: 'uploads/receipts' }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Receipt of an Expense',
    type: FileUploadDto,
  })
  uploadReceipt(
    @ActiveUser('sub') userId: number,
    @Param('id') expenseId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({
            fileType: 'image/png',
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    receiptFile: Express.Multer.File,
  ) {
    return this.expensesService.uploadReceipt(userId, expenseId, receiptFile);
  }
}
