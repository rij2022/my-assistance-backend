import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SpecialInterestGroupService } from './special-interest-group.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('special-interest-groups')
export class SpecialInterestGroupController {
  constructor(private readonly specialInterestGroupService: SpecialInterestGroupService) {}

  @Get()
  async getGroups(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 3,
  ) {
    return this.specialInterestGroupService.getSpecialInterestGroups(search, page, pageSize);
  }

  @Get(':id')
  async getGroupDetails(@Param('id') id: string) {
    return this.specialInterestGroupService.getGroupDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/join')
  async joinGroup(@Param('id') id: string, @Request() req) {
    console.log('Join Group Request:', { groupId: id, userId: req.user.userId });
    return this.specialInterestGroupService.joinGroup(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/leave')
  async leaveGroup(@Param('id') id: string, @Request() req) {
    console.log('Leave Group Request:', { groupId: id, userId: req.user.userId });
    return this.specialInterestGroupService.leaveGroup(id, req.user.userId);
  }

  // Comment management endpoints
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') groupId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Request() req,
  ) {
    console.log('Add Comment Request:', { groupId, userId: req.user.userId, text: createCommentDto.text });
    const group = await this.specialInterestGroupService.getGroupDetails(groupId);
    if (!group.memberIds.includes(req.user.userId)) {
      throw new UnauthorizedException('You must join this group to comment');
    }
    return this.specialInterestGroupService.addComment(groupId, req.user.userId, createCommentDto.text);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':groupId/comments/:commentId')
  async editComment(
    @Param('groupId') groupId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    console.log('Edit Comment Request:', { groupId, commentId, userId: req.user.userId, newText: updateCommentDto.text });
    const comment = await this.specialInterestGroupService.getComment(groupId, commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }
    if (comment.userId.toString() !== req.user.userId) {
      throw new UnauthorizedException('You can only edit your own comments');
    }
    return this.specialInterestGroupService.editComment(groupId, commentId, updateCommentDto.text);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':groupId/comments/:commentId')
  async deleteComment(
    @Param('groupId') groupId: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    console.log('Delete Comment Request:', { groupId, commentId, userId: req.user.userId });

    const comment = await this.specialInterestGroupService.getComment(groupId, commentId);
    if (!comment) {
      throw new Error('Comment not found');
    }

    console.log('Comment Ownership Check:', {
      authenticatedUserId: req.user.userId,
      commentUserId: comment.userId.toString(),
    });

    // Ensure data types are consistent by converting ObjectId to string
    if (comment.userId.toString() !== req.user.userId) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    return this.specialInterestGroupService.deleteComment(groupId, commentId);
  }
}