import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { USER_SERVICE_NAME } from '@repo/config/users';
import { CreateUserDto, UpdateUserDto } from '@repo/contracts/users';
import { users } from '@repo/proto/users/interface';

@Injectable()
export class UsersService implements OnModuleInit {
  private userService: users.UsersService;

  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.userService =
      this.userClient.getService<users.UsersService>(USER_SERVICE_NAME);
  }

  async create(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  findOne(id: number) {
    return this.userService.findOne({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userService.updateUser({
      ...updateUserDto,
      id,
    });
  }

  remove(id: number) {
    return this.userService.deleteUser({ id });
  }
}
