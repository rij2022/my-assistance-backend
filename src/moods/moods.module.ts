import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodsController } from './moods.controller';
import { MoodsService } from './moods.service';
import { MoodOptionSchema } from './schemas/mood-option.schema';
import { UserMoodSchema } from './schemas/user-mood.schema'; // ✅ Add this
import { UserMood } from './schemas/user-mood.schema';
  

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'MoodOption', schema: MoodOptionSchema },
      { name: 'UserMood', schema: UserMoodSchema }, // ✅ Add this too
    ])
    
  ],
  controllers: [MoodsController],
  providers: [MoodsService],
})
export class MoodsModule {}
