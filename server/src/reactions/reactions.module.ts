import { Module } from '@nestjs/common';
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';
import { PostsService } from '../posts/posts.service';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService, PostsService],
})
export class ReactionsModule {}
