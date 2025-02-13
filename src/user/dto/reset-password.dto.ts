import { IsNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  email: string;



  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
