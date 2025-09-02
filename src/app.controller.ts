import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './iam/authentication/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  ping() {
    return {
      statusCode: HttpStatus.OK,
      message: 'Application and Database are running...',
    };
  }
}
