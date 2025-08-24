import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
import { ActiveUser } from 'src/iam/authentication/active-user.decorator';
import { Roles } from 'src/iam/authorization/roles.decorator';
import { Role } from './enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  @Roles(Role.USER)
  @Get('me')
  getUser(@ActiveUser('sub') userId: number) {
    return this.usersService.findUserId(userId);
  }

  @Roles(Role.ADMIN)
  @Get()
  getUsers() {
    return this.usersService.findAllUsers();
  }
}