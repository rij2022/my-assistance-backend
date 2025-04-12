import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { TaskSchema } from './schemas/task.schema';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || '55dc9d194ef26afcac0230b5880c573b91d029d39a75cd3a313bdb30c9faa368dbda01f3e795eb30397560c977559510afa7da25aba31586f2d59500b1ff9c8b',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [TaskController, TaskController],
  providers: [TaskService, TaskService],
  exports: [TaskService],
})
export class TaskModule {}