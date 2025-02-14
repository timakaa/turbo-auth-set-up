import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserPatterns,
} from '@repo/contracts/users';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern(UserPatterns.CREATE_USER)
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @MessagePattern(UserPatterns.FIND_ALL_USER)
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern(UserPatterns.GET_USER)
  findOne(@Payload() id: number) {
    return this.usersService.findOne(id);
  }

  @MessagePattern(UserPatterns.UPDATE_USER)
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern(UserPatterns.DELETE_USER)
  remove(@Payload() id: number) {
    return this.usersService.remove(id);
  }
}
