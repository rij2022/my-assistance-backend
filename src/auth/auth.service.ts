import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import { User } from 'src/user/schemas/user.schema';
import { Console, log } from 'console';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.hashedPassword)) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {

    const payload = { email: user._doc.email, sub: user._doc._id.toString()};
  
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999); // Generate a 6-digit OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 min

    // Store OTP in database
    await this.userModel.updateOne(
      { email },
      { $set: { otp, otpExpiresAt: expiresAt } }
    );

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'arijlaatigue01@gmail.com',
        pass: 'hgbyhjmhleykchlw',
      },
    });

    const mailOptions = {
      from: 'arijlaatigue01@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `A password change has been requested for your account. If this was you, please use the One time password  below to reset your password.Your OTP is ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'OTP sent successfully' };
  }
  async verifyOtp(email: string, otp: number) {
    const user = await this.userModel.findOne({ email });
  
    if (!user || user.otp !== otp || new Date() > user.otpExpiresAt) {
      return { success: false, message: 'Invalid or expired OTP' };
    }
  
    // Clear OTP after verification
    await this.userModel.updateOne({ email }, { $unset: { otp: "", otpExpiresAt: "" } });
  
    return { success: true, message: 'OTP verified' };
  }
  
}