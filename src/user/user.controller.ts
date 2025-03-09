import { Controller, Post, Body, Get, Put, Delete, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
  @Put('reset-password')
  async resetPassword(@Body() resetDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetDto);
  }
@UseGuards(JwtAuthGuard)
@Get('users')
async getUsers(@Request() req) : Promise<any>{
  const users = await this.userService.findAll()
  return users
}
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    console.log('Authenticated User:', req.user);
    const user = this.userService.findByEmail(req.user.email);
    console.log(user);
    return user 
    
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return this.userService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async delete(@Request() req): Promise<User> {
    return this.userService.delete(req.user.userId);
  }


}
