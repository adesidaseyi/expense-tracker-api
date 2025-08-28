import {
  IsDefined,
  IsInt,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class NewExpenseDto {
  @IsDefined({ message: 'Category ID is required' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Category ID must be a Number' },
  )
  @IsInt({ message: 'Category ID must be an Integer' })
  @IsPositive({ message: 'Category ID must be a Positive Integer' })
  categoryId: number;

  @IsDefined({ message: 'Expense amount is required' })
  @IsNotEmpty({ message: 'Expense amount cannot be empty' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Expense amount must be a Number' },
  )
  @Min(0.01, { message: 'Expense amount must be greater than Zero' })
  amount: number;

  @IsDefined({ message: 'Currency is required' })
  @IsNotEmpty({ message: 'Currency cannot be empty' })
  @IsISO4217CurrencyCode({
    message: 'Currency must be of ISO42171 string format',
  })
  currency: string;

  @IsOptional()
  @IsString({ message: 'Note must be a string' })
  @IsDefined({ message: 'Note must be defined' })
  @MaxLength(100, { message: 'Note cannot exceed 100 characters' })
  note?: string;

  @IsDefined({ message: 'SpentAt date is required' })
  @IsNotEmpty({ message: 'SpentAt date cannot be empty' })
  @IsISO8601(
    { strict: false, strictSeparator: false },
    { message: 'SpentAt date must be of ISO8601 string format' },
  )
  spentAt: string;
}
