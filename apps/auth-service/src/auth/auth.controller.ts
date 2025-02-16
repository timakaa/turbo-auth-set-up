import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { AuthPatterns } from '@repo/contracts/auth';
import { CreateUserDto, Role } from '@repo/contracts/users';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthPatterns.LOGIN)
  login(@Payload() loginDto: { userId: number; name: string; role: Role }) {
    return this.authService.login(loginDto);
  }

  @MessagePattern(AuthPatterns.SIGNUP)
  signup(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @MessagePattern(AuthPatterns.LOGOUT)
  logout(@Payload() userId: number) {
    return this.authService.logout(userId);
  }

  @MessagePattern(AuthPatterns.VALIDATE_GOOGLE_USER)
  validateGoogleUser(@Payload() googleUser: CreateUserDto) {
    return this.authService.validateGoogleUser(googleUser);
  }

  // TODO: Create real DTO in contracts
  @MessagePattern(AuthPatterns.VALIDATE_LOCAL_USER)
  validateLocalUser(
    @Payload() localValidateDto: { email: string; password: string },
  ) {
    return this.authService.validateLocalUser(
      localValidateDto.email,
      localValidateDto.password,
    );
  }

  @MessagePattern(AuthPatterns.VALIDATE_REFRESH_TOKEN)
  validateRefreshToken(
    @Payload() refreshTokenDto: { userId: number; name: string },
  ) {
    return this.authService.validateRefreshToken(
      refreshTokenDto.userId,
      refreshTokenDto.name,
    );
  }

  @MessagePattern(AuthPatterns.VALIDATE_JWT_USER)
  validateJwtUser(@Payload() jwtValidateDto: { userId: number }) {
    return this.authService.validateJwtUser(jwtValidateDto.userId);
  }

  @MessagePattern(AuthPatterns.REFRESH_TOKEN)
  refreshToken(@Payload() refreshTokenDto: { userId: number; name: string }) {
    return this.authService.refreshToken(
      refreshTokenDto.userId,
      refreshTokenDto.name,
    );
  }
}
