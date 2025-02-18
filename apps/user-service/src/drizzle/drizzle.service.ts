import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDbClient, userServiceSchema } from '@repo/db';
import { Pool } from 'pg';

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;
  public db: Awaited<ReturnType<typeof createDbClient>>;

  constructor(private config: ConfigService) {
    const connectionString = this.config.get<string>('DATABASE_URL');
    this.db = createDbClient(connectionString, userServiceSchema);
  }

  async onModuleInit() {
    // Connection is established when db client is created
  }

  async onModuleDestroy() {
    await this.pool?.end();
  }
}
