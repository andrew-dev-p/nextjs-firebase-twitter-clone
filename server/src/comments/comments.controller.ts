import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
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
}
