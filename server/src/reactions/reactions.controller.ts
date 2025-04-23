import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { AuthGuard } from '../auth.guard';
import { GetUser } from '../get-user.decorator';
import { UserEntity } from '../types/entities';

@Controller('reactions')
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Post('like')
  @UseGuards(AuthGuard)
  async toggleLike(
    @Body('postId') postId: string,
    @GetUser() user: UserEntity,
  ) {
    return this.reactionsService.toggleLike(postId, user);
  }

  @Post('dislike')
  @UseGuards(AuthGuard)
  async toggleDislike(
    @Body('postId') postId: string,
    @GetUser() user: UserEntity,
  ) {
    return this.reactionsService.toggleDislike(postId, user);
  }
}
