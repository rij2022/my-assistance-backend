export class UpdateTaskDto {
    title?: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    startDate?: Date;
    endDate?: Date;
    period?: 'morning' | 'evening' | 'night';
    subtasks?: { title: string; estimation: string; completed?: boolean }[];
  }