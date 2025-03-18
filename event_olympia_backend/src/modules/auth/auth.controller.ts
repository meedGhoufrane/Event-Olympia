// src/modules/auth/auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Request, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() body: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) {
    return this.authService.register(body.email, body.password, body.firstName, body.lastName, body.role);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
  
  @Post('forgot-password')
  async requestPasswordReset(@Body() body: { email: string }) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() body: { password: string }) {
    return this.authService.resetPassword(token, body.password);
  }
}