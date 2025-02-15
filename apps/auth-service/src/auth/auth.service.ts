import {
  UserPatterns,
  Role,
  USER_SERVICE_NAME,
  CreateUserDto,
} from '@repo/contracts/users';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { refreshJwtConfig as refreshConfig } from '@repo/auth/config';
import { firstValueFrom } from 'rxjs';
import { hash, verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}

  async login(userId: number, name: string, role: Role) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await firstValueFrom(
      this.userClient.send(UserPatterns.UPDATE_HASHED_REFRESH_TOKEN, {
        id: userId,
        hashedRefreshToken: hashedRT,
      }),
    );
    return {
      id: userId,
      name: name,
      role,
      accessToken,
      refreshToken,
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await firstValueFrom(
      this.userClient.send(UserPatterns.GET_USER_BY_EMAIL, createUserDto.email),
    );
    if (user) throw new ConflictException('User already exists!');
    return await firstValueFrom(
      this.userClient.send(UserPatterns.CREATE_USER, createUserDto),
    );
  }

  async logout(userId: number) {
    return await firstValueFrom(
      this.userClient.send(UserPatterns.UPDATE_HASHED_REFRESH_TOKEN, {
        id: userId,
        hashedRefreshToken: null,
      }),
    );
  }

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

  async validateJwtUser(userId: number) {
    const user = await firstValueFrom(
      this.userClient.send(UserPatterns.GET_USER, userId),
    );
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await firstValueFrom(
      this.userClient.send(UserPatterns.GET_USER, userId),
    );
    if (!user) throw new UnauthorizedException('User not found!');

    const refreshTokenMatched = await verify(
      user.hashedRefreshToken,
      refreshToken,
    );

    if (!refreshTokenMatched)
      throw new UnauthorizedException('Invalid Refresh Token!');
    const currentUser = { id: user.id };
    return currentUser;
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await firstValueFrom(
      this.userClient.send(UserPatterns.GET_USER_BY_EMAIL, googleUser.email),
    );
    if (user) return user;
    return await firstValueFrom(
      this.userClient.send(UserPatterns.CREATE_USER, googleUser),
    );
  }

  async validateLocalUser(email: string, password: string) {
    const user = await firstValueFrom(
      this.userClient.send(UserPatterns.GET_USER_BY_EMAIL, email),
    );
    if (!user) throw new UnauthorizedException('User not found!');
    const isPasswordMatched = verify(user.password, password);
    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials!');

    return { id: user.id, name: user.name, role: user.role };
  }

  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateTokens(userId);
    const hashedRT = await hash(refreshToken);
    await firstValueFrom(
      this.userClient.send(UserPatterns.UPDATE_HASHED_REFRESH_TOKEN, {
        id: userId,
        hashedRefreshToken: hashedRT,
      }),
    );
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }
}
