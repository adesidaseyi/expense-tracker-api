import { IsNumber, IsOptional, IsPositive, IsEnum } from "class-validator";

export enum OrderEnum {
    ASC = "asc",
    DESC = "desc"
}

export class QueryDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    page?: number;

    @IsOptional()
    @IsEnum(OrderEnum)
    order_spent_at?: OrderEnum;

    @IsOptional()
    @IsEnum(OrderEnum)
    order_amount?: OrderEnum;
}