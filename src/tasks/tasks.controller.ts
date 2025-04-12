import { Controller, Post, Body, Get, UseGuards, Request, Param, Put, Delete } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from'./dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user.userId, createTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req) {
    return this.taskService.findAllByUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.taskService.findOne(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.taskService.update(id, req.user.userId, updateTaskDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.taskService.remove(id, req.user.userId);
  }
}