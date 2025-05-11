import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type SpecialInterestGroupDocument = SpecialInterestGroup & Document;

@Schema({ timestamps: true })
export class SpecialInterestGroup {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 0 })
  memberCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  memberIds: string[];

  @Prop({ required: true })
  createdAt: Date;
  
  // Virtual field that will be populated by the service
  comments?: any[];
}

export const SpecialInterestGroupSchema = SchemaFactory.createForClass(SpecialInterestGroup);