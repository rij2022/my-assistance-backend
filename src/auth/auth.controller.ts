import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      console.log("im the user ",user)
      throw new UnauthorizedException('Invalid email or password');
      
    }
  
    return this.authService.login(user);
  }
  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }
  @Post('verify-otp')
async verifyOtp(@Body() { email, otp }: { email: string; otp: number }) {
  return this.authService.verifyOtp(email, otp);
}

}