import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
}