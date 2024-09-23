import { Body, Controller, Get, HttpException, Post, Request, UseGuards } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocaGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  @UseGuards(LocaGuard)
  login(@Body() authPayload: AuthPayloadDto) {
    const user = this.authService.validateUser(authPayload);
    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }
    return user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    console.log(req.user);
  }
}
