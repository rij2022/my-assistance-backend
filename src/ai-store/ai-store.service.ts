import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AiCharacter, AiCharacterDocument } from './schemas/ai-character.schema';
import { CreateCharacterDto } from './dto/create-character.dto';

@Injectable()
export class AiStoreService {
  constructor(
    @InjectModel(AiCharacter.name)
    private readonly aiModel: Model<AiCharacterDocument>,
  ) {}

  async create(dto: CreateCharacterDto): Promise<AiCharacter> {
    const created = new this.aiModel(dto);
    return created.save();
  }

  async findAll(): Promise<AiCharacter[]> {
    return this.aiModel.find().exec();
  }

  async findOne(id: string): Promise<AiCharacter> {
    return this.aiModel.findById(id).exec();
  }
}
