import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "../authorization/roles.guard";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { 
                expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
                audience: process.env.JWT_TOKEN_AUDIENCE,
                issuer: process.env.JWT_TOKEN_ISSUER,
            },
        }),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AuthModule {}