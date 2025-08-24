import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserRegisterDto } from "src/users/dto/user-register.dto";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { Public } from "./public.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Public()
    @Post('register')
    register(@Body() userRegisterDto: UserRegisterDto) {
        return this.authService.register(userRegisterDto);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(@Body() userLoginDto: UserLoginDto) {
        return this.authService.login(userLoginDto);
    }
}