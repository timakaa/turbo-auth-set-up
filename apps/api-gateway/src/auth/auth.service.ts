import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { CreateUserDto, Role } from '@repo/contracts/users';
import { AUTH_SERVICE_NAME } from '@repo/config/auth';
import { auth } from '@repo/proto/auth/interfaces';
import { firstValueFrom } from 'rxjs';
import console from 'console';

@Injectable()
export class AuthService implements OnModuleInit {
  private authService: auth.AuthService;

  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly authClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.authClient.getService<auth.AuthService>('AuthService');
  }

  async login(userId: number, name: string, role: Role) {
    const user = await firstValueFrom(
      this.authService.login({
        userId,
        name,
        role,
      }),
    );

    return user;
  }

  async signOut(userId: number) {
    return this.authService.logout({ userId });
  }

  async registerUser(createUserDto: CreateUserDto) {
    const user = await firstValueFrom(this.authService.signUp(createUserDto));
    return user;
  }

  async refreshToken(userId: number, name: string) {
    return this.authService.refreshToken({
      userId,
      name,
    });
  }
}
