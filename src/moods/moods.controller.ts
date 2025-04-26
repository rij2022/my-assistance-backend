import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MoodsService } from './moods.service'; // ✅ Make sure it's imported
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateMoodOptionDto } from './dto/create-mood-option.dto';
import { SelectMoodDto } from './dto/select-mood-option.dto';
import { Request } from '@nestjs/common';

@Controller('moods')
export class MoodsController {
  constructor(private readonly moodService: MoodsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('options')
  async createMoodOption(@Body() dto: CreateMoodOptionDto) {
    return this.moodService.createMoodOption(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('options')
  async getMoodOptions() {
    return this.moodService.getAllMoodOptions();
  }

  @UseGuards(JwtAuthGuard)
@Post('select')
async selectMood(@Request() req, @Body() dto: SelectMoodDto) {
    return this.moodService.selectMood(req.user.userId, dto);
}

@UseGuards(JwtAuthGuard)
@Get('history')
async getMoodHistory(@Request() req) {
  return this.moodService.getMoodHistory(req.user.userId);
}

@UseGuards(JwtAuthGuard)
@Get('tracker')
async getMoodTrackerData(@Request() req) {
  return this.moodService.getMoodTrackerData(req.user.userId);
}


}
