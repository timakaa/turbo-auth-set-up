import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  Get,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  GoogleAuthGuard,
  LocalAuthGuard,
  RefreshAuthGuard,
} from '@repo/auth/guards';
import { Public } from '@repo/auth/decorators';
import { CreateUserDto } from '@repo/contracts/users';
import { Response } from 'express';
import { FRONTEND_URL } from '@repo/config/web';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req) {
    return this.authService.login(req.user.id, req.user.name, req.user.role);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Request() req, @Res() res: Response) {
    // console.log('Entering googleCallback');
    // console.log('Request query:', req.query);
    // console.log('Request user:', req.user);
    const response = await this.authService.login(
      req.user.id,
      req.user.name,
      req.user.role,
    );
    // console.log('RESPONSE -------', response);
    res.redirect(
      `${FRONTEND_URL}/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role=${response.role}`,
    );
  }

  @Post('signout')
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}
