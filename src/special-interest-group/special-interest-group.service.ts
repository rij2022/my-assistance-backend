import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SpecialInterestGroup, SpecialInterestGroupDocument } from './schemas/special-interest-group.schema';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class SpecialInterestGroupService {
  // AI-generated group themes - this would be expanded in a real app
  private readonly groupThemes = [
    {'topic': 'Urban Photography', 'tags': ['photography', 'urban', 'cities']},
    {'topic': 'Science Fiction Books', 'tags': ['books', 'scifi', 'reading']},
    {'topic': 'Indoor Plants', 'tags': ['plants', 'gardening', 'indoor']},
    {'topic': 'Drone Flying', 'tags': ['drones', 'tech', 'aerial']},
    {'topic': 'Vintage Vinyl', 'tags': ['music', 'vinyl', 'vintage']},
    {'topic': 'Sustainable Living', 'tags': ['eco', 'sustainability', 'green']},
    {'topic': 'Film Photography', 'tags': ['film', 'analog', 'photography']},
    {'topic': 'Hiking Adventures', 'tags': ['hiking', 'outdoors', 'trails']},
    {'topic': 'Coffee Enthusiasts', 'tags': ['coffee', 'brewing', 'beans']},
    {'topic': 'DIY Home Projects', 'tags': ['diy', 'crafts', 'home']},
    {'topic': 'Pixel Art Creation', 'tags': ['pixelart', 'digital', 'art']},
    {'topic': 'Local Foraging', 'tags': ['foraging', 'nature', 'food']},
    {'topic': 'Meditation Practice', 'tags': ['meditation', 'wellness', 'mindfulness']},
    {'topic': 'Documentary Films', 'tags': ['documentaries', 'film', 'nonfiction']},
    {'topic': 'Electric Vehicles', 'tags': ['ev', 'cars', 'sustainable']},
  ];

  // AI creative descriptions for groups
  private readonly groupDescriptionTemplates = [
    'A community for passionate {topic} lovers to share tips, experiences, and inspiration.',
    'Connect with fellow {topic} enthusiasts to learn new techniques and showcase your latest projects.',
    'Explore the world of {topic} together with like-minded individuals from around the globe.',
    'Share your {topic} journey, ask questions, and get feedback from our friendly community.',
    'Join our {topic} group to discover new perspectives and deepen your knowledge.',
    'A welcoming space for both beginners and experts in {topic} to collaborate and grow.',
  ];

  private lastGroupGenerated: Date;

  constructor(
    @InjectModel(SpecialInterestGroup.name) private specialInterestGroupModel: Model<SpecialInterestGroupDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {
    this.lastGroupGenerated = new Date();
    this.checkAndGenerateNewGroup();
  }

  async checkAndGenerateNewGroup() {
    // Check if any groups exist
    const count = await this.specialInterestGroupModel.countDocuments().exec();
    
    if (count === 0) {
      // Initialize with a few groups if none exist
      for (let i = 0; i < 5; i++) {
        await this.generateAIGroup();
      }
      return;
    }
    
    const now = new Date();
    const difference = now.getTime() - this.lastGroupGenerated.getTime();
    
    // Check if it's been at least 24 hours since the last group was generated
    if (difference >= 24 * 60 * 60 * 1000) {
      await this.generateAIGroup();
      this.lastGroupGenerated = now;
    }
  }

  async generateAIGroup() {
    // Pick a random theme
    const random = Math.floor(Math.random() * this.groupThemes.length);
    const theme = this.groupThemes[random];
    const topic = theme.topic;
    const tags = theme.tags;
    
    // Generate a description
    const descTemplate = this.groupDescriptionTemplates[
      Math.floor(Math.random() * this.groupDescriptionTemplates.length)
    ];
    const description = descTemplate.replace('{topic}', topic.toLowerCase());
    
    // URL-encode the group name for the Pollinations prompt
    const prompt = encodeURIComponent(topic);
    
    const newGroup = new this.specialInterestGroupModel({
      name: topic,
      description: description,
      imageUrl: `https://image.pollinations.ai/prompt/${prompt}`,
      memberCount: 0,
      tags: tags,
      memberIds: [],
      createdAt: new Date(),
    });
    
    // Save the new group
    await newGroup.save();
    
    // Check if we've exceeded the maximum number of groups (12)
    const totalGroups = await this.specialInterestGroupModel.countDocuments().exec();
    if (totalGroups > 12) {
      // Remove the oldest group
      const oldestGroup = await this.specialInterestGroupModel
        .findOne()
        .sort({ createdAt: 1 })
        .exec();
      
      if (oldestGroup) {
        await this.specialInterestGroupModel.findByIdAndDelete(oldestGroup._id).exec();
      }
    }
    
    return newGroup;
  }

  async getSpecialInterestGroups(search?: string, page: number = 1, pageSize: number = 3) {
    await this.checkAndGenerateNewGroup();
    
    // Build the query
    let query = this.specialInterestGroupModel.find();
    
    // Filter by search term (name or tags)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      query = query.where({
        $or: [
          { name: searchRegex },
          { tags: searchRegex },
        ],
      });
    }
    
    // Sort by creation date (newest first)
    query = query.sort({ createdAt: -1 });
    
    // Paginate
    const skip = (page - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
    
    return query.exec();
  }

  async getGroupDetails(groupId: string) {
    const group = await this.specialInterestGroupModel.findById(groupId).exec();
    if (!group) {
      throw new Error('Group not found');
    }
  
    // Fetch comments and populate user details
    const comments = await this.commentModel
      .find({ groupId: groupId })
      .populate('user', 'name') // Populate only the 'name' field from the User model
      .sort({ createdAt: -1 })
      .exec();
  
    // Attach comments to the group with userName included
    const groupWithComments = group.toObject();
    groupWithComments.comments = comments.map(comment => ({
      ...comment.toObject(),
      userName: comment.user?.name || 'Unknown', // Ensure userName is set
    }));
    return groupWithComments;
  }
  async joinGroup(groupId: string, userId: string) {
    const group = await this.specialInterestGroupModel
      .findById(groupId)
      .exec();
      
    if (!group) {
      throw new Error('Group not found');
    }
    
    // Check if user is already a member
    if (!group.memberIds.includes(userId)) {
      group.memberIds.push(userId);
      group.memberCount += 1;
      await group.save();
    }
    
    return group;
  }

  async leaveGroup(groupId: string, userId: string) {
    const group = await this.specialInterestGroupModel
      .findById(groupId)
      .exec();
      
    if (!group) {
      throw new Error('Group not found');
    }
    
    // Check if user is a member
    const index = group.memberIds.indexOf(userId);
    if (index > -1) {
      group.memberIds.splice(index, 1);
      group.memberCount -= 1;
      await group.save();
    }
    
    return group;
  }

  // COMMENT MANAGEMENT

  async getComment(groupId: string, commentId: string) {
    return this.commentModel
      .findOne({ _id: commentId, groupId: groupId })
      .exec();
  }
 async addComment(groupId: string, userId: string, text: string) {
  const comment = new this.commentModel({
    groupId,
    userId,
    text,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const savedComment = await comment.save();

  // Populate the user details for the newly created comment
  const populatedComment = await this.commentModel
    .findById(savedComment._id)
    .populate('user', 'name')
    .exec();

  return {
    ...populatedComment.toObject(),
    userName: populatedComment.user?.name || 'Unknown', // Ensure userName is set
  };
}

  async editComment(groupId: string, commentId: string, newText: string) {
    const comment = await this.commentModel
      .findOne({ _id: commentId, groupId: groupId })
      .exec();
      
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    comment.text = newText;
    comment.updatedAt = new Date();
    
    return comment.save();
  }

  async deleteComment(groupId: string, commentId: string) {
    const result = await this.commentModel
      .deleteOne({ _id: commentId, groupId: groupId })
      .exec();
      
    return result.deletedCount > 0;
  }
  
}