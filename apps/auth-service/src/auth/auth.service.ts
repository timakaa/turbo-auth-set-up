import { UserPatterns, Role, CreateUserDto } from '@repo/contracts/users';
import {
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { hash, verify } from 'argon2';
import { TokenService } from '@repo/auth';
import { USER_SERVICE_NAME } from '@repo/config/users';
import { users } from '@repo/proto/users/interface';
import console from 'console';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: users.UsersService;

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientGrpc,
    private readonly tokenService: TokenService,
  ) {}

  async onModuleInit() {
    this.userService =
      this.userClient.getService<users.UsersService>(USER_SERVICE_NAME);
  }

  async login(loginDto: { userId: number; name: string; role: Role }) {
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(loginDto.userId);

    const hashedRT = await hash(refreshToken);

    await firstValueFrom(
      this.userService.updateHashedRefreshToken({
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
    const response = await firstValueFrom(
      this.userService.findByEmail({ email: createUserDto.email }),
    );

    if (response.user) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: 'User already exists!',
      });
    }

    const newUser = await firstValueFrom(
      this.userService.createUser({
        ...createUserDto,
        provider: 'local',
      }),
    );

    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(newUser.id);

    const hashedRT = await hash(refreshToken);
    await firstValueFrom(
      this.userService.updateHashedRefreshToken({
        id: newUser.id,
        hashedRefreshToken: hashedRT,
      }),
    );

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    return await firstValueFrom(
      this.userService.updateHashedRefreshToken({
        id: userId,
        hashedRefreshToken: null,
      }),
    );
  }

  async validateJwtUser(userId: number) {
    const user = await firstValueFrom(this.userService.findOne({ id: userId }));
    if (!user) throw new UnauthorizedException('User not found!');
    const currentUser = { id: user.id, role: user.role };
    return currentUser;
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await firstValueFrom(this.userService.findOne({ id: userId }));
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

  async validateGoogleUser(googleUser: {
    email: string;
    name: string;
    password: '';
  }) {
    const response = await firstValueFrom(
      this.userService.findByEmail({ email: googleUser.email }),
    );
    console.log('Google User -----------', googleUser);
    if (response.user) return response.user;
    return await firstValueFrom(
      this.userService.createUser({
        ...googleUser,
        provider: 'google',
      }),
    );
  }

  async validateLocalUser(email: string, password: string) {
    const response = await firstValueFrom(
      this.userService.findByEmail({ email }),
    );
    const user = response.user;
    if (!user) throw new UnauthorizedException('User not found!');
    if (user.provider !== 'local')
      throw new UnauthorizedException('Invalid Credentials!');
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
      this.userService.updateHashedRefreshToken({
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
