import { IsString, IsIn } from 'class-validator';

export class CreateMoodOptionDto {
  @IsString()
  label: string;

  @IsString()
  emoji: string;

  @IsString()
  description: string; // ✅ ADD THIS LINE

  @IsIn(['green', 'yellow', 'red'])
  zone: 'green' | 'yellow' | 'red';

  @IsString()
  color: string;
}
