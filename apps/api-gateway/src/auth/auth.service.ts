import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, Role } from '@repo/contracts/users';
import { AUTH_SERVICE_NAME, AuthPatterns } from '@repo/contracts/auth';

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
}
