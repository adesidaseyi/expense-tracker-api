import { IsDefined, IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from "class-validator";

export class UserRegisterDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string;

    @IsString({ message: 'Firstname must be a string' })
    @IsDefined({ message: 'Firstname is required' })
    @IsNotEmpty({ message: 'Firstname cannot be empty' })
    @Length(3, 20, { message: 'Firstname must be between 2 and 100 characters long.' })
    firstName: string;

    @IsString({ message: 'Lastname must be a string' })
    @IsDefined({ message: 'Lastname is required' })
    @IsNotEmpty({ message: 'Lastname cannot be empty' })
    @Length(3, 20, { message: 'Lastname must be between 2 and 100 characters long.' })
    lastName: string;
}