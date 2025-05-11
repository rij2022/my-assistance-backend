import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: true }) 
export class Subtask {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  estimation: string;

  @Prop({ default: false }) // 👈 Add this
  completed: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
