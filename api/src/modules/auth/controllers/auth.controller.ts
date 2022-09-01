import { Body, Controller, Get, Injectable, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/auth-login.dto';

@Controller()
export class AuthController {
  @Post()
  public async login(@Body() body: LoginDto): Promise<string> {
    return 'login';
  }
}
