import { UserPatterns, Role, USER_SERVICE_NAME } from '@repo/contracts/users';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { refreshJwtConfig as refreshConfig } from '@repo/auth/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async login(userId: number, name: string, role: Role) {}

  async generateTokens(userId: number) {
    const payload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(userId: number, name: string, role: Role) {}

  async logout(userId: number) {}

  async googleLogin() {}

  async googleCallback() {}
}
