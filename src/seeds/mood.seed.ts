import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { MoodsService } from '../moods/moods.service';
import { CreateMoodOptionDto } from '../moods/dto/create-mood-option.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const moodService = app.get(MoodsService);

  const predefinedMoods: CreateMoodOptionDto[] = [
    {
      label: 'Joyful',
      emoji: '😂',
      description: 'Feeling very happy and amused',
      zone: 'green',
      color: '#00D68F',
    },
    {
      label: 'Inspired',
      emoji: '😎',
      description: 'Feeling confident and energized',
      zone: 'green',
      color: '#00D68F',
    },
    {
      label: 'Neutral',
      emoji: '😐',
      description: 'Feeling okay, neither good nor bad',
      zone: 'yellow',
      color: '#FFD93D',
    },
    {
      label: 'Anxious',
      emoji: '😭',
      description: 'Feeling worried or tense',
      zone: 'red',
      color: '#FF5C5C',
    },
    {
      label: 'Meltdown',
      emoji: '🥵',
      description: 'Feeling overwhelmed or emotionally exhausted',
      zone: 'red',
      color: '#FF5C5C',
    },
  ];

  for (const mood of predefinedMoods) {
    const exists = await moodService.findByLabel(mood.label);
    if (!exists) {
      await moodService.createMoodOption(mood);
    }
  }

  console.log('✅ Mood options seeded!');
  await app.close();
}

bootstrap();
