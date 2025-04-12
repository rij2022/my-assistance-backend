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
}

export const TaskSchema = SchemaFactory.createForClass(Task);