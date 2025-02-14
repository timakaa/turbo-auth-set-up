import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@repo/contracts/users';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...user } = createUserDto;
      const candidate = await this.findByEmail(user.email);
      if (candidate) {
        const error = {
          status: HttpStatus.BAD_REQUEST,
          message: 'User already exists',
        };
        throw new RpcException(error);
      }
      const hashedPassword = await hash(password);
      return await this.prisma.user.create({
        data: {
          password: hashedPassword,
          ...user,
        },
      });
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error.message);
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async remove(userId: number) {
    return await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hashedRefreshToken: hashedRT,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }
}
