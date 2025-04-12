export class CreateTaskDto {
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    startDate: Date;
    endDate: Date;
    period: 'morning' | 'evening' | 'night';
  }