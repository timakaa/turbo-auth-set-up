import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthPatterns } from '@repo/contracts/auth';
import { Role } from '@repo/contracts/users';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthPatterns.LOGIN)
  login(@Payload() userId: number, name: string, role: Role) {
    return this.authService.login(userId, name, role);
  }

  @MessagePattern(AuthPatterns.SIGNUP)
  signup(@Payload() userId: number, name: string, role: Role) {
    return this.authService.register(userId, name, role);
  }

  @MessagePattern(AuthPatterns.LOGOUT)
  logout(@Payload() userId: number) {
    return this.authService.logout(userId);
  }

  @MessagePattern(AuthPatterns.GOOGLE_LOGIN)
  googleLogin() {
    return this.authService.googleLogin();
  }

  @MessagePattern(AuthPatterns.GOOGLE_CALLBACK)
  googleCallback() {
    return this.authService.googleCallback();
  }
}
