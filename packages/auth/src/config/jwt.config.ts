import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load auth package environment variables
const loadAuthConfig = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  const authEnv = dotenv.config({ path: envPath }).parsed || {};
  return authEnv;
};

export const jwtConfig = registerAs('jwt', (): JwtModuleOptions => {
  const authEnv = loadAuthConfig();
  return {
    secret: authEnv.JWT_SECRET,
    signOptions: {
      expiresIn: authEnv.JWT_EXPIRES_IN,
    },
  };
});
