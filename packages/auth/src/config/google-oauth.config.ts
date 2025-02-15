import { registerAs } from '@nestjs/config';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load auth package environment variables
const loadAuthConfig = () => {
  const envPath = path.resolve(__dirname, '../../.env');
  const authEnv = dotenv.config({ path: envPath }).parsed || {};
  return authEnv;
};

export const googleOAuthConfig = registerAs('googleOAuth', () => {
  const authEnv = loadAuthConfig();
  return {
    clientID: authEnv.GOOGLE_CLINET_ID,
    clientSecret: authEnv.GOOGLE_CLIENT_SECRET,
    callbackURL: authEnv.GOOGLE_CALLBACK_URL,
  };
});
