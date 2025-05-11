import { IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SubtaskDto {
  title: string;
  estimation: string;
  completed?: boolean;
}

export class UpdateSubtasksDto {
  @IsArray()
  @MaxLength(5, { message: 'You can only add up to 5 subtasks' })
  @ValidateNested({ each: true })
  @Type(() => SubtaskDto)
  subtasks: SubtaskDto[];
}
