import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { GetUser } from '../get-user.decorator';
import { UserEntity } from 'src/types/entities';

export enum SortOption {
  Recent = 'recent',
  MostLikes = 'most-likes',
  MostComments = 'most-comments',
}

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @GetUser() user: UserEntity,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, user.uid);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query('userId') userId?: string,
    @Query('sortOption') sortOption?: SortOption,
    @Query('cursor') cursor?: string,
    @Query('limit') limit = 10,
  ) {
    return this.postsService.findAll(userId, sortOption, cursor, +limit);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    const deleted = await this.postsService.remove(id);
    if (!deleted) throw new NotFoundException('Post not found');
    return { deleted };
  }
}
