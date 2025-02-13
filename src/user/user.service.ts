import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { log } from 'node:console';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try{
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
  
    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      hashedPassword,
    });

    return await newUser.save();}
    catch(error){
      if (error.code === 11000) { // ✅ MongoDB duplicate key error
        throw new ConflictException('Email is already in use');
      }
      throw error;
    }

 
  
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    console.log('from service:', user); // Now user is not a Promise
    return user;
}

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
  const updateData: Partial<User> = {};

  if (updateUserDto.name) {
    updateData.name = updateUserDto.name;
  }
  if (updateUserDto.email) {
    updateData.email = updateUserDto.email;
  }
  if (updateUserDto.password) {
    updateData.hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
  }
  console.log(updateData)

  return this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
}
async resetPassword(resetDto: ResetPasswordDto) {
  const { email, newPassword } = resetDto;

  const user = await this.userModel.findOne({ email });

  if (!user) {
    throw new BadRequestException('User not found');
  }



  // Hash new password
 
  user.hashedPassword = await bcrypt.hash(newPassword, 10);

  // Clear OTP after successful reset
  user.otp = null;
  await user.save();

  return { success: true, message: 'Password reset successful' };
}


  async delete(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (user && await bcrypt.compare(password, user.hashedPassword)) {
      return user;
    }
    return null;
  }
}
