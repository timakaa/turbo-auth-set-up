import { Controller, HttpStatus } from '@nestjs/common';
import { GrpcMethod, Payload, RpcException } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserPatterns,
} from '@repo/contracts/users';
import { USER_SERVICE_NAME } from '@repo/config/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.CREATE_USER)
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.FIND_ONE)
  async findOne(@Payload() { id }: { id: number }) {
    return this.usersService.findOne({ id });
  }

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.UPDATE_USER)
  async update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.DELETE_USER)
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.UPDATE_HASHED_REFRESH_TOKEN)
  async updateHashedRefreshToken(
    @Payload() updateUserDto: { id: number; hashedRefreshToken: string },
  ) {
    return this.usersService.updateHashedRefreshToken(
      updateUserDto.id,
      updateUserDto.hashedRefreshToken,
    );
  }

  @GrpcMethod(USER_SERVICE_NAME, UserPatterns.FIND_BY_EMAIL)
  async findByEmail(@Payload() { email }: { email: string }) {
    const user = await this.usersService.findByEmail(email);
    return user;
  }
}
