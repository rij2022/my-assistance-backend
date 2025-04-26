import { Schema, Document, Types } from 'mongoose';
import { MoodOption } from './mood-option.schema';
export const UserMoodSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true },
  moodOptionId: { type: Types.ObjectId, ref: 'MoodOption', required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface UserMood extends Document {
  userId: Types.ObjectId;
  moodOptionId: MoodOption; // ✅ tell TS this is a populated MoodOption object
  timestamp: Date;
}