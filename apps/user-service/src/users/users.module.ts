import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DrizzleService } from 'src/drizzle/drizzle.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, DrizzleService],
})
export class UsersModule {}
