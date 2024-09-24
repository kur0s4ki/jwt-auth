import { Body, Controller, Get, HttpException, Post, Request, UseGuards, Res } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocaGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Response as ExpressResponse } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req) {
    // guard will handle redirection
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Request() req) {
    const userProfile = req.user;
    if (!userProfile) {
      throw new HttpException('User not found', 404);
    }
    return {
      message: 'Logged in successfully',
      data: userProfile,
    };
  }
  @Post('login')
  @UseGuards(LocaGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    const user = this.authService.validateUser(authPayload);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    return user;
  }

  @Get('profile-custom')
  @UseGuards(JwtAuthGuard)
  getProfileCustom(@Request() req, @Res() res: ExpressResponse) {
    const userProfile = req.user;
    if (!userProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Profile fetched successfully',
      data: userProfile,
    });
  }

  @Get('profile-passthrough')
  @UseGuards(JwtAuthGuard)
  getProfilePassthrough(@Request() req, @Res({ passthrough: true }) res: ExpressResponse) {
    const userProfile = req.user;
    if (!userProfile) {
      throw new HttpException('User not found', 404);
    }

    res.setHeader('X-Custom-Header', 'CustomHeaderValue');

    return {
      message: 'Profile fetched successfully',
      data: userProfile,
    };
  }
}
function googleAuth(arg0: any, req: any) {
  throw new Error('Function not implemented.');
}
