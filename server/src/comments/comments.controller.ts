import {
  Body,
  Controller,
  Post,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/auth.guard';
import { GetUser } from 'src/get-user.decorator';
import { UserEntity } from 'src/types/entities';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createComment(
    @GetUser() user: UserEntity,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createComment(dto, user.uid);
  }

  @Post('reply')
  @UseGuards(AuthGuard)
  async createReply(@GetUser() user: UserEntity, @Body() dto: CreateReplyDto) {
    return this.commentsService.createReply(dto, user.uid);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateComment(
    @GetUser() user: UserEntity,
    @Body() dto: UpdateCommentDto,
  ) {
    return this.commentsService.updateComment(dto, user.uid);
  }

  @Patch('reply')
  @UseGuards(AuthGuard)
  async updateReply(@GetUser() user: UserEntity, @Body() dto: UpdateReplyDto) {
    return this.commentsService.updateReply(dto, user.uid);
  }

  @Delete()
  @UseGuards(AuthGuard)
  async deleteComment(
    @GetUser() user: UserEntity,
    @Body() dto: DeleteCommentDto,
  ) {
    return this.commentsService.deleteComment(dto, user.uid);
  }

  @Delete('reply')
  @UseGuards(AuthGuard)
  async deleteReply(@GetUser() user: UserEntity, @Body() dto: DeleteReplyDto) {
    return this.commentsService.deleteReply(dto, user.uid);
  }
}
