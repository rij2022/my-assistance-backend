import { Schema, Document } from 'mongoose';

export const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  otp: { type: Number, required: false },
  score: { type: Number, required: false },  
  otpExpiresAt: { type: Date, required: false },
  
});

export interface User extends Document {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
  otp?: number;
  score?: number;
  otpExpiresAt?: Date;
}