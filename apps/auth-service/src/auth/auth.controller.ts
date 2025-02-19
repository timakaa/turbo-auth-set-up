import { Controller } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthPatterns } from '@repo/contracts/auth';
import { CreateUserDto, Role } from '@repo/contracts/users';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', AuthPatterns.LOGIN)
  login(@Payload() loginDto: { userId: number; name: string; role: Role }) {
    return this.authService.login(loginDto);
  }

  @GrpcMethod('AuthService', AuthPatterns.SIGNUP)
  signup(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @GrpcMethod('AuthService', AuthPatterns.LOGOUT)
  logout(@Payload() userId: number) {
    return this.authService.logout(userId);
  }

  @GrpcMethod('AuthService', AuthPatterns.VALIDATE_GOOGLE_USER)
  validateGoogleUser(
    @Payload() googleUser: { email: string; name: string; password: '' },
  ) {
    return this.authService.validateGoogleUser(googleUser);
  }

  @GrpcMethod('AuthService', AuthPatterns.VALIDATE_LOCAL_USER)
  validateLocalUser(
    @Payload() { email, password }: { email: string; password: string },
  ) {
    return this.authService.validateLocalUser(email, password);
  }

  @GrpcMethod('AuthService', AuthPatterns.VALIDATE_REFRESH_TOKEN)
  validateRefreshToken(
    @Payload()
    { userId, refreshToken }: { userId: number; refreshToken: string },
  ) {
    return this.authService.validateRefreshToken(userId, refreshToken);
  }

  @GrpcMethod('AuthService', AuthPatterns.VALIDATE_JWT_USER)
  validateJwtUser(@Payload() userId: number) {
    return this.authService.validateJwtUser(userId);
  }

  @GrpcMethod('AuthService', AuthPatterns.REFRESH_TOKEN)
  refreshToken(@Payload() refreshTokenDto: { userId: number; name: string }) {
    return this.authService.refreshToken(
      refreshTokenDto.userId,
      refreshTokenDto.name,
    );
  }
}
