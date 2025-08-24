import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, genSalt, hash } from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ActiveUserData } from "./active-user-data.interface";
import { UserRegisterDto } from "src/users/dto/user-register.dto";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { UserService } from "src/users/users.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ){}

    async register(userRegisterDto: UserRegisterDto) {
        try {
            const salt: string = await genSalt();
            const hashedPassword = await hash(userRegisterDto.password, salt);
            await this.userService.createUser(
                userRegisterDto.email, 
                hashedPassword,
                userRegisterDto.firstName,
                userRegisterDto.lastName
            );
            return "Successful";
        } catch(err) {
            const pgUniqueErrorViolationCode = '23505';
            if (err.code === pgUniqueErrorViolationCode) {
                throw new ConflictException('Email already exists');
            }
            throw err; 
        }
    }

    async login(userLoginDto: UserLoginDto) {
        try {
            const user = await this.userService.findUserEmail(userLoginDto.email);
            if (!user) {
                throw new UnauthorizedException('Invalid email or password');
            }
            const isEqual: boolean = await compare(userLoginDto.password, user.password);
            if (!isEqual) {
                throw new UnauthorizedException('Invalid email or password');
            }

            const accessToken = await this.jwtService.signAsync(
                {
                    sub: user.id,
                    email: user.email,
                    role: user.role,
                } as ActiveUserData,
                {
                    audience: this.configService.get<string>('JWT_TOKEN_AUDIENCE'),
                    issuer: this.configService.get<string>('JWT_TOKEN_ISSUER'),
                    secret: this.configService.get<string>('JWT_SECRET'),
                    expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_TTL'),
                },
            );
            return { accessToken };
        } catch(err) {
            throw err;
        }
    }
}