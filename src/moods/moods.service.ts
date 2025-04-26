import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodOption } from './schemas/mood-option.schema'; // ✅ Update if needed
import { CreateMoodOptionDto } from './dto/create-mood-option.dto';
import { Injectable } from '@nestjs/common';
import { SelectMoodDto } from './dto/select-mood-option.dto';
import { UserMood } from './schemas/user-mood.schema'; // ✅ Replace with correct path if different
import { MoodTrackerEntryDto } from './dto/mood-tracker-entry.dto';

@Injectable()
export class MoodsService {
  constructor(
    @InjectModel('MoodOption') private readonly moodOptionModel: Model<MoodOption>,
    @InjectModel('UserMood') private readonly userMoodModel: Model<UserMood>, 
  ) {}

  async createMoodOption(dto: CreateMoodOptionDto): Promise<MoodOption> {
    const newOption = new this.moodOptionModel(dto);
    return await newOption.save();
  }

  async getAllMoodOptions(): Promise<MoodOption[]> {
    return await this.moodOptionModel.find().exec();
  }
  async findByName(name: string) {
    return this.moodOptionModel.findOne({ name });
  }
  async findByLabel(label: string): Promise<MoodOption | null> {
    return this.moodOptionModel.findOne({ label }).exec();
  }

  async selectMood(userId: string, dto: SelectMoodDto): Promise<UserMood> {
    const mood = new this.userMoodModel({
      userId,
      moodOptionId: dto.moodOptionId,
      timestamp: new Date(),
    });
    return await mood.save();
  }
  
  async getMoodHistory(userId: string): Promise<UserMood[]> {
    return this.userMoodModel.find({ userId }).populate('moodOptionId').sort({ timestamp: -1 }).exec();
  }


  async getMoodTrackerData(userId: string): Promise<MoodTrackerEntryDto[]> {
    const history = await this.userMoodModel.find({ userId })
      .populate('moodOptionId') // fetch emoji, color, zone
      .sort({ timestamp: 1 })    // oldest first
      .exec();
  
    return history.map(entry => ({
      timestamp: entry.timestamp,
      emoji: entry.moodOptionId.emoji,
      color: entry.moodOptionId.color,
      zone: entry.moodOptionId.zone,
    }));
  }
  
  
}
