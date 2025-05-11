import { Controller, Post, Body, Get, Put, Delete, UseGuards, Request, UnauthorizedException ,BadRequestException } from '@nestjs/common';
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
    const user = await this.userService.findByEmail(req.user.email);
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
  @UseGuards(JwtAuthGuard)
@Post('generate-parent-code')
async generateCode(@Request() req) {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  await this.userService.setParentCode(req.user.userId, code);
  return { code };
}
@UseGuards(JwtAuthGuard)
@Post('link-to-child')
async linkToChild(@Request() req, @Body() body: { code: string }) {
  await this.userService.linkToChild(req.user.userId, body.code);
  return { message: 'Parent successfully linked to child.' };
}
@UseGuards(JwtAuthGuard)
@Get('my-child')
async getMyChild(@Request() req) {
  const child = await this.userService.getLinkedChild(req.user.userId);
  return child ?? { message: 'No child linked yet.' };
}
 

@UseGuards(JwtAuthGuard)
@Post('send-code-to-parent')
async sendCodeToParent(
  @Request() req,
  @Body() body: { email: string }
) {
  const { email } = body;
  const child = await this.userService.findOne(req.user.userId);
  if (!child?.parentCode) throw new BadRequestException("No parent code generated");

  await this.userService.emailParentCode(email, child.name, child.parentCode);
  return { success: true, message: 'Email sent to parent' };
}





}
