import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto, Role } from '@repo/contracts/users';
import { AuthPatterns } from '@repo/contracts/auth';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientProxy,
  ) {}

  async login(userId: number, name: string, role: Role) {
    const user = await firstValueFrom(
      this.authClient.send(AuthPatterns.LOGIN, {
        userId,
        name,
        role,
      }),
    );

    return user;
  }

  async signOut(userId: number) {
    return firstValueFrom(this.authClient.send(AuthPatterns.LOGOUT, userId));
  }

  async registerUser(createUserDto: CreateUserDto) {
    return firstValueFrom(
      this.authClient.send(AuthPatterns.SIGNUP, createUserDto),
    );
  }

  async refreshToken(userId: number, name: string) {
    return firstValueFrom(
      this.authClient.send(AuthPatterns.REFRESH_TOKEN, {
        userId,
        name,
      }),
    );
  }
}
