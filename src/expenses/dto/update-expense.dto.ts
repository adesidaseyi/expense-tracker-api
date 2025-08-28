import {
  IsDefined,
  IsISO4217CurrencyCode,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateExpenseDto {
  @IsOptional()
  @IsDefined({ message: 'Expense amount must be defined' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Expense amount must be a Number' },
  )
  @Min(0.01, { message: 'Expense amount must be greater than Zero' })
  amount?: number;

  @IsOptional()
  @IsDefined({ message: 'Currency must be defined' })
  @IsISO4217CurrencyCode({
    message: 'Currency must be of ISO42171 string format',
  })
  currency?: string;

  @IsOptional()
  @IsString({ message: 'Note must be defined' })
  @IsDefined({ message: 'Note is required' })
  @MaxLength(100, { message: 'Note cannot exceed 100 characters' })
  note?: string;

  @IsOptional()
  @IsDefined({ message: 'SpentAt date must be defined' })
  @IsISO8601(
    { strict: false, strictSeparator: false },
    { message: 'SpentAt date must be of ISO8601 string format' },
  )
  spentAt?: string;
}
