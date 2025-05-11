import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SubtaskDto } from './dto/update-subtasks.dto';
import { Subtask } from './schemas/subtask.schema'

@Injectable()
export class TaskService {
  constructor(@InjectModel('Task') private readonly taskModel: Model<Task>) {}

  async create(userId: string, createTaskDto: CreateTaskDto): Promise<Task> {
    console.log('TaskService.create called with userId:', userId, 'and createTaskDto:', createTaskDto);
    const newTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return newTask.save().then((savedTask) => {
      console.log('Task created:', savedTask);
      return savedTask;
    }).catch((error) => {
      console.error('Error creating task:', error);
      throw error;
    });
  }

  async findAllByUser(userId: string): Promise<Task[]> {
    console.log('TaskService.findAllByUser called with userId:', userId);
    return this.taskModel.find({ userId }).exec().then((tasks) => {
      console.log('Tasks found:', tasks);
      return tasks;
    }).catch((error) => {
      console.error('Error finding tasks:', error);
      throw error;
    });
  }
  async findAllByUserAndPeriod(userId: string, period: string): Promise<Task[]> {
    console.log('TaskService.findAllByUserAndPeriod called with userId:', userId), period;
    return this.taskModel.find({ userId, period }).exec().then((tasks) => {
      console.log('Tasks found:', tasks);
      return tasks;
    }).catch((error) => {
      console.error('Error finding tasks:', error);
      throw error;
    });
   
  }
  
  async findAllByUserAndStatus(userId: string, status: string): Promise<Task[]> {
    console.log('TaskService.findAllByUserAndStatus called with userId:', userId, status);
     return this.taskModel.find({ userId, status }).exec().then((tasks) => {
      console.log('Tasks found:', tasks);
      return tasks;
    }).catch((error) => {
      console.error('Error finding tasks:', error);
      throw error;
    });
   
  }
  
  async findAllByUserAndDate(userId: string, date: Date): Promise<Task[]> {
    // Find tasks where startDate or endDate is on the same day as 'date'
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    console.log('TaskService.findAllByUserAndDate called with userId:', userId, date);
    return this.taskModel.find({ 
      userId,
      startDate: { $gte: startOfDay, $lte: endOfDay }
    }).exec().then((tasks) => {
     console.log('Tasks found:', tasks);
     return tasks;
   }).catch((error) => {
     console.error('Error finding tasks:', error);
     throw error;
   });
  

  }


  async findOne(id: string, userId: string): Promise<Task> {
    console.log('TaskService.findOne called with id:', id, 'and userId:', userId);
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      console.log('Task not found with id:', id);
      throw new NotFoundException('Task not found');
    }
    console.log('Task found:', task);
    return task;
  }

  async update(id: string, userId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    console.log('TaskService.update called with id:', id, 'userId:', userId, 'and updateTaskDto:', updateTaskDto);
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      console.log('Task not found for update with id:', id);
      throw new NotFoundException('Task not found');
    }
    console.log('Task updated:', updatedTask);
    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<Task> {
    console.log('TaskService.remove called with id:', id, 'and userId:', userId);
    const deletedTask = await this.taskModel
      .findOneAndDelete({ _id: id, userId })
      .exec();
    if (!deletedTask) {
      console.log('Task not found for deletion with id:', id);
      throw new NotFoundException('Task not found');
    }
    console.log('Task deleted:', deletedTask);
    return deletedTask;
  }
// subtasks
async addSubtasks(
  taskId: string,
  userId: string,
  subtasks: { title: string; estimation: string }[]
): Promise<Task> {
  console.log('Received taskId:', taskId);
  console.log('Received userId:', userId);
  console.log('Received subtasks:', subtasks);

  const task = await this.taskModel.findOne({ _id: taskId, userId });
  if (!task) {
    console.error('Task not found for user:', userId);
    throw new NotFoundException('Task not found');
  }

  if (!Array.isArray(subtasks)) {
    throw new BadRequestException('Subtasks must be an array');
  }

  // Debug: log current subtasks
  console.log('Existing subtasks count:', task.subtasks.length);
  console.log('Trying to add', subtasks.length, 'subtasks');

  if (task.subtasks.length + subtasks.length > 5) {
    console.warn('Subtask limit exceeded');
    throw new BadRequestException('Cannot exceed 5 subtasks for a task');
  }

  // Validate individual subtasks
  for (const subtask of subtasks) {
    if (!subtask.title || !subtask.estimation) {

      throw new BadRequestException('Each subtask must have a title and estimation');
    }
    console.log('Validation passed for all subtasks');
  }
  console.log('Validation passed for all subtasks');

  // Add new subtasks with default completed: false
  const formattedSubtasks = subtasks.map(subtask => ({
    ...subtask,
    completed: false,
  }));

  task.subtasks.push(...formattedSubtasks);

  const savedTask = await task.save();
  console.log('Subtasks successfully added. New count:', savedTask.subtasks.length);
  return savedTask;
}

async toggleSubtaskCompletion(taskId: string, subtaskIndex: number): Promise<Task> {
  const task = await this.taskModel.findById(taskId);
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const subtask = task.subtasks[subtaskIndex];
  if (!subtask) {
    throw new NotFoundException('Subtask not found');
  }

  subtask.completed = !subtask.completed; // Toggle completion
  return task.save();
}
async getSubtasks(taskId: string): Promise<{ title: string; estimation: string; completed: boolean }[]> {
  const task = await this.taskModel.findById(taskId);
  if (!task) {
    throw new NotFoundException('Task not found');
  }
  return task.subtasks;
}
async deleteSubtask(taskId: string, subtaskIndex: number): Promise<Task> {
  const task = await this.taskModel.findById(taskId);
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  const subtask = task.subtasks[subtaskIndex];
  if (!subtask) {
    throw new NotFoundException('Subtask not found');
  }

  task.subtasks.splice(subtaskIndex, 1); // Remove the subtask
  return task.save();
}


}