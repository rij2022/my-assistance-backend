import { Schema, Document } from 'mongoose';

export const MoodSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export interface Mood extends Document {
  userId: string;
  mood: string;
  timestamp: Date;
}
