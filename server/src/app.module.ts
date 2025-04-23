import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ReactionsModule } from './reactions/reactions.module';

@Module({
  imports: [PostsModule, ReactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
