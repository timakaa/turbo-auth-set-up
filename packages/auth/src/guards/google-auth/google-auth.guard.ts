import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor() {
    super({
      accessType: 'offline',
      prompt: 'consent',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const activate = await super.canActivate(context);
      console.log('GoogleAuthGuard canActivate result:', activate);
      return activate as boolean;
    } catch (error) {
      console.error('GoogleAuthGuard error:', error);
      throw error;
    }
  }

  handleRequest(err: any, user: any, info: any) {
    console.log('GoogleAuthGuard handleRequest:', { err, user, info });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
