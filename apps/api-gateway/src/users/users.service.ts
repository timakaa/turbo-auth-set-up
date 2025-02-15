import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  UpdateUserDto,
  USER_SERVICE_NAME,
  UserPatterns,
} from '@repo/contracts/users';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_SERVICE_NAME) private readonly userClient: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.userClient.send(UserPatterns.CREATE_USER, createUserDto);
  }

  findAll() {
    return this.userClient.send(UserPatterns.FIND_ALL_USER, {});
  }

  findOne(id: number) {
    return this.userClient.send(UserPatterns.GET_USER, id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userClient.send(UserPatterns.UPDATE_USER, {
      ...updateUserDto,
      id,
    });
  }

  remove(id: number) {
    return this.userClient.send(UserPatterns.DELETE_USER, id);
  }
}
