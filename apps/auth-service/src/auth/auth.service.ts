import { UserPatterns, Role, CreateUserDto } from '@repo/contracts/users';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { hash, verify } from 'argon2';
import { TokenService } from '@repo/auth';
import { USER_SERVICE_NAME } from '@repo/config/users';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientProxy,
    private readonly tokenService: TokenService,
  ) {}

  async login(loginDto: { userId: number; name: string; role: Role }) {
    console.log(loginDto);
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(loginDto.userId);
    const hashedRT = await hash(refreshToken);
    await firstValueFrom(
      this.userClient.send(UserPatterns.UPDATE_HASHED_REFRESH_TOKEN, {
        id: loginDto.userId,
        hashedRefreshToken: hashedRT,
      }),
    );
    return {
      id: loginDto.userId,
      name: loginDto.name,
      role: loginDto.role,
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
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userId);
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
