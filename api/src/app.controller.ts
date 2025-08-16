import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  home() { return { status: 'App is working fine' }; }

  @Get('health')
  health() { return { status: 'ok' }; }

  @Get('hello')
  getHello(): string { return this.appService.getHello(); }
}