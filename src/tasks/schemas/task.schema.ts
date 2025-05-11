import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'], 
    default: 'pending' 
  })
  status: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ 
    type: String, 
    enum: ['morning', 'evening', 'night'], 
    default: 'morning' 
  })
  period: string;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ type: [{ title: String, estimation: String, completed: { type: Boolean, default: false } }], default: [] })
  subtasks: { title: string; estimation: string; completed: boolean }[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);