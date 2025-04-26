import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AiStoreController } from './ai-store.controller';
import { AiStoreService } from './ai-store.service';
import { AiCharacter, AiCharacterSchema } from './schemas/ai-character.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiCharacter.name, schema: AiCharacterSchema },
    ]),
  ],
  controllers: [AiStoreController],
  providers: [AiStoreService],
})
export class AiStoreModule {}
