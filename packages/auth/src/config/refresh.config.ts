import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load auth package environment variables
const loadAuthConfig = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  const authEnv = dotenv.config({ path: envPath }).parsed || {};
  return authEnv;
};

export const refreshJwtConfig = registerAs(
  'refresh-jwt',
  (): JwtSignOptions => {
    const authEnv = loadAuthConfig();
    return {
      secret: authEnv.REFRESH_JWT_SECRET,
      expiresIn: authEnv.REFRESH_JWT_EXPIRES_IN,
    };
  },
);
