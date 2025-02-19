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
      const hashedPassword = password ? await hash(password) : '';
      const newUser = await this.drizzle.db
        .insert(userServiceSchema.users)
        .values({
          password: hashedPassword,
          name: user.name,
          ...user,
        })
        .returning();

      return { ...newUser[0] };
    } catch (error) {
      console.log('Caught error:', error);
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException(error.message);
    }
  }

  async findByEmail(email: string) {
    const user = await this.drizzle.db
      .select()
      .from(userServiceSchema.users)
      .where(eq(userServiceSchema.users.email, email))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      return { notFound: {} };
    }

    return { user };
  }

  async findAll() {
    return await this.drizzle.db.select().from(userServiceSchema.users);
  }

  async remove(userId: number) {
    return await this.drizzle.db
      .delete(userServiceSchema.users)
      .where(eq(userServiceSchema.users.id, userId))
      .returning();
  }

  async findOne({ id }: { id: number }) {
    const user = await this.drizzle.db
      .select()
      .from(userServiceSchema.users)
      .where(eq(userServiceSchema.users.id, id))
      .limit(1)
      .then((rows) => rows[0]);

    if (!user) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: `User not found`,
      });
    }

    return user;
  }

  async updateHashedRefreshToken(userId: number, hashedRT: string | null) {
    const updatedUser = await this.drizzle.db
      .update(userServiceSchema.users)
      .set({
        hashedRefreshToken: hashedRT,
      })
      .where(eq(userServiceSchema.users.id, userId))
      .returning();

    return { ...updatedUser[0] };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.drizzle.db
      .update(userServiceSchema.users)
      .set(updateUserDto)
      .where(eq(userServiceSchema.users.id, id))
      .returning();
  }
}
