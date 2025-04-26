import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AiCharacterDocument = AiCharacter & Document;

@Schema()
export class AiCharacter {
  @Prop({ required: true })
  name: string;

  @Prop()
  background: string;

  @Prop()
  lottieUrl: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop([String])
  moodTags: string[];

  @Prop()
  voice?: string;
}

export const AiCharacterSchema = SchemaFactory.createForClass(AiCharacter);
