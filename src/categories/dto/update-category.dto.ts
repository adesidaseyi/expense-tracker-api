import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsNotEmpty({ message: 'Category name cannot be empty' })
  @IsString({ message: 'Category name must be a string' })
  @MaxLength(50, { message: 'Category name cannot exceed 50 characters' })
  name: string;
}
