import { Injectable, HttpStatus } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@repo/contracts/users';
import { hash } from 'argon2';
import { RpcException } from '@nestjs/microservices';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { eq } from 'drizzle-orm';
import { userServiceSchema } from '@repo/db';

@Injectable()
export class UsersService {
  constructor(private readonly drizzle: DrizzleService) {}

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
      return await this.drizzle.db.insert(userServiceSchema.users).values({
        password: hashedPassword,
        ...user,
      });
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error.message);
    }
  }

  async findByEmail(email: string) {
    return await this.drizzle.db
      .select()
      .from(userServiceSchema.users)
      .where(eq(userServiceSchema.users.email, email))
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  async findAll() {
    return await this.drizzle.db.select().from(userServiceSchema.users);
  }

  async remove(userId: number) {
    return await this.drizzle.db
      .delete(userServiceSchema.users)
      .where(eq(userServiceSchema.users.id, userId));
  }

  async findOne(userId: number) {
    return await this.drizzle.db
      .select()
      .from(userServiceSchema.users)
      .where(eq(userServiceSchema.users.id, userId))
      .limit(1)
      .then((rows) => rows[0] || null);
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    return await this.drizzle.db
      .update(userServiceSchema.users)
      .set({
        hashedRefreshToken: hashedRT,
      })
      .where(eq(userServiceSchema.users.id, userId));
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.drizzle.db
      .update(userServiceSchema.users)
      .set(updateUserDto)
      .where(eq(userServiceSchema.users.id, id));
  }
}
