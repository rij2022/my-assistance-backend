import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { log } from 'node:console';
import { ResetPasswordDto } from './dto/reset-password.dto';
import * as nodemailer from 'nodemailer';


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
      role: createUserDto.role || 'child',
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

  async setParentCode(userId: string, code: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { parentCode: code });
  }
  async linkToChild(parentId: string, code: string): Promise<void> {
    const child = await this.userModel.findOne({ parentCode: code });
    if (!child) {
      throw new Error('Child not found with this code');
    }
  
    await this.userModel.findByIdAndUpdate(parentId, { linkedChildId: child._id });
  }
  async getLinkedChild(parentId: string): Promise<User | null> {
    const parent = await this.userModel.findById(parentId).populate('linkedChildId');
    return parent?.linkedChildId || null;
  }
  async emailParentCode(email: string, childName: string, code: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mkaouaremna2@gmail.com',       // ✅ ton email
        pass: 'jbmqotnwnxmbrjpu',  
      },
    });
  
    const mailOptions = {
      from: 'mkaouaremna2@gmail.com',
      to: email,
      subject: `Parent Code from ${childName}`,
      html: `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
      <div style="max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #6C63FF; text-align: center;">👨‍👩‍👧 Invitation from ${childName}</h2>
        <p style="font-size: 16px; color: #333;">Hi there!</p>
        <p style="font-size: 16px; color: #333;">
          <strong>${childName}</strong> has invited you to join them as their assistant in the <strong>MyAssistance</strong> app.
        </p>
        <p style="font-size: 16px; color: #333;">Use the code below to connect:</p>

        <input 
          type="text" 
          value="${code}" 
          readonly 
          style="width: 100%; padding: 10px; font-size: 20px; text-align: center; border: 2px solid #6C63FF; border-radius: 6px; background-color: #f0f0f0; color: #333;"
        />

        <p style="font-size: 14px; color: #666; margin-top: 16px;">You can select and copy the code above.</p>
      </div>
    </div>
  `,    
  };
  
    await transporter.sendMail(mailOptions);
  }
  
  
  
  
}
