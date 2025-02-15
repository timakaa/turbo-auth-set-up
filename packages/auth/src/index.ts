import { JwtModule, JwtService } from '@nestjs/jwt';
import { refreshJwtConfig as refreshConfig } from './config/refresh.config';
import { Inject, Injectable, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from './config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

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
}

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(refreshConfig),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
