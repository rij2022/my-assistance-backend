import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialInterestGroupController } from './special-interest-group.controller';
import { SpecialInterestGroupService } from './special-interest-group.service';
import { SpecialInterestGroup, SpecialInterestGroupSchema } from './schemas/special-interest-group.schema';
import { Comment, CommentSchema } from './schemas/comment.schema'; // Add this import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecialInterestGroup.name, schema: SpecialInterestGroupSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [SpecialInterestGroupController],
  providers: [SpecialInterestGroupService],
  exports: [SpecialInterestGroupService],
})
export class SpecialInterestGroupModule {}