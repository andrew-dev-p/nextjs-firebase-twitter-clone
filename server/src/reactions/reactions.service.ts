import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsService } from '../posts/posts.service';
import { UserEntity } from '../types/entities';

@Injectable()
export class ReactionsService {
  constructor(private readonly postsService: PostsService) {}

  async toggleLike(postId: string, user: UserEntity) {
    const post = await this.postsService.findOne(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userId = user.uid;
    const hasLiked = post.likes.includes(userId);

    let update: {
      likes?: string[];
      likesCount?: number;
      dislikes?: string[];
      dislikesCount?: number;
    } | null = null;

    if (hasLiked) {
      update = {
        likes: post.likes.filter((id) => id !== userId),
        likesCount: post.likesCount - 1,
      };
    } else {
      update = {
        likes: [...post.likes, userId],
        likesCount: post.likesCount + 1,

        dislikes: post.dislikes.filter((id) => id !== userId),
        dislikesCount: post.dislikes.includes(userId)
          ? post.dislikesCount - 1
          : post.dislikesCount,
      };
    }
    return this.postsService.update(postId, update);
  }

  async toggleDislike(postId: string, user: UserEntity) {
    const post = await this.postsService.findOne(postId);
    if (!post) throw new NotFoundException('Post not found');

    const userId = user.uid;
    const hasDisliked = post.dislikes.includes(userId);

    let update: {
      likes?: string[];
      likesCount?: number;
      dislikes?: string[];
      dislikesCount?: number;
    } | null = null;

    if (hasDisliked) {
      update = {
        dislikes: post.dislikes.filter((id) => id !== userId),
        dislikesCount: post.dislikesCount - 1,
      };
    } else {
      update = {
        dislikes: [...post.dislikes, userId],
        dislikesCount: post.dislikesCount + 1,

        likes: post.likes.filter((id) => id !== userId),
        likesCount: post.likes.includes(userId)
          ? post.likesCount - 1
          : post.likesCount,
      };
    }
    return this.postsService.update(postId, update);
  }
}
