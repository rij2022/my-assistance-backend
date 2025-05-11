import { IsString, IsEmail, MinLength, IsNotEmpty ,IsOptional ,IsIn, IsNumber } from 'class-validator';
import { Number } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString({message: "please provide your name"})
  name: string;
 
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsOptional()
  @IsIn(['child', 'parent'], { message: 'Role must be either child or parent' })
  role?: 'child' | 'parent';

  @IsNumber()
  score: string;
}