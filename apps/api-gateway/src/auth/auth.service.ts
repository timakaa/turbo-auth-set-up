import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, Role } from '@repo/contracts/users';
import { AUTH_SERVICE_NAME } from './constant';
import { AuthPatterns } from '@repo/contracts/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly userClient: ClientProxy,
  ) {}

  async login(userId: number, name: string, role: Role) {
    const user = await firstValueFrom(
      this.userClient.send(AuthPatterns.LOGIN, {
        userId,
        name,
        role,
      }),
    );

    return user;
  }

  async signOut(userId: number) {
    return firstValueFrom(this.userClient.send(AuthPatterns.LOGOUT, userId));
  }

  async registerUser(createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.SIGNUP, createUserDto),
    );
  }

  async googleLogin() {
    return firstValueFrom(this.userClient.send(AuthPatterns.GOOGLE_LOGIN, {}));
  }

  async refreshToken(userId: number, name: string) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.REFRESH_TOKEN, {
        userId,
        name,
      }),
    );
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.VALIDATE_REFRESH_TOKEN, {
        userId,
        refreshToken,
      }),
    );
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.VALIDATE_GOOGLE_USER, googleUser),
    );
  }

  async validateLocalUser(email: string, password: string) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.VALIDATE_LOCAL_USER, {
        email,
        password,
      }),
    );
  }

  async validateJwtUser(userId: number) {
    return firstValueFrom(
      this.userClient.send(AuthPatterns.VALIDATE_JWT_USER, userId),
    );
  }
}
