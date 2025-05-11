import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })

export class Comment {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'SpecialInterestGroup' })
  groupId: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;

  // Add the user field (optional) for populated user details
  user?: User; // Optional field for populated user details
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

// Add a virtual field for the user details
CommentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Enable virtuals in the JSON output
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });