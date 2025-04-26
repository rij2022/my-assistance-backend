import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AiStoreService } from './ai-store.service';
import { CreateCharacterDto } from './dto/create-character.dto';

@Controller('ai-store')
export class AiStoreController {
  constructor(private readonly aiStoreService: AiStoreService) {}

  @Post()
  async create(@Body() dto: CreateCharacterDto) {
    return this.aiStoreService.create(dto);
  }

  @Get()
  async findAll() {
    return this.aiStoreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.aiStoreService.findOne(id);
  }
}
