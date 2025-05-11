import { Controller, Post, Body, Get, UseGuards, Request, Param, Put, Delete, Query } from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from'./dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSubtasksDto } from './dto/update-subtasks.dto';

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
  @UseGuards(JwtAuthGuard)
  @Get('filter/period/:period')
  async findAllByPeriod(@Request() req, @Param('period') period: string) {
    return this.taskService.findAllByUserAndPeriod(req.user.userId, period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/status/:status')
  async findAllByStatus(@Request() req, @Param('status') status: string) {
    return this.taskService.findAllByUserAndStatus(req.user.userId, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter/date')
  async findAllByDate(@Request() req, @Query('date') date: string) {
    const dateObj = new Date(date);
    return this.taskService.findAllByUserAndDate(req.user.userId, dateObj);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':taskId/subtasks')
  async addSubtasks(
    @Request() req,
    @Param('taskId') taskId: string,
    @Body('subtasks') subtasks: { title: string; estimation: string }[],
  ) {
    return this.taskService.addSubtasks(taskId, req.user.userId, subtasks);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':taskId/subtasks')
  async getSubtasks(@Param('taskId') taskId: string) {
    return this.taskService.getSubtasks(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':taskId/subtasks/:subtaskIndex')
  async toggleSubtaskCompletion(@Param('taskId') taskId: string, @Param('subtaskIndex') subtaskIndex: number) {
    return this.taskService.toggleSubtaskCompletion(taskId, subtaskIndex);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':taskId/subtasks/:subtaskIndex')
  async deleteSubtask(@Param('taskId') taskId: string, @Param('subtaskIndex') subtaskIndex: number) {
    return this.taskService.deleteSubtask(taskId, subtaskIndex);
  }


}