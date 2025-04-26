import { Schema, Document } from 'mongoose';

export const MoodOptionSchema = new Schema({
  label: { type: String, required: true },
  emoji: { type: String, required: true },
  description: { type: String, required: true },
  zone: { type: String, enum: ['green', 'yellow', 'red'], required: true },
  color: { type: String, required: true },
});

export interface MoodOption extends Document {
  label: string;
  emoji: string;
  description: string;
  zone: 'green' | 'yellow' | 'red';
  color: string; // hex color like "#FF5252"
}
