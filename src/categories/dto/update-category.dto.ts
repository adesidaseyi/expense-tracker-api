import { IsDefined, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsDefined({ message: 'Category name is required' })
    @IsNotEmpty({ message: 'Category name cannot be empty' })
    @IsString({ message: 'Category name must be a string' })
    @MaxLength(50, { message: 'Category name cannot exceed 50 characters' })
    name?: string;
}