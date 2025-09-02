import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class MonthQueryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Date must be in YYYY-MM format',
  })
  month: string;
}
