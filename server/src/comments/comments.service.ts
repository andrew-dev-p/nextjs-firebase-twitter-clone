import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { CommentEntity } from '../types/entities';
import { CreateCommentDto } from './dto';

@Injectable()
export class CommentsService {
  private collection = firestore.collection('posts');

  async createComment(dto: CreateCommentDto, userId: string) {
    const { postId, content } = dto;
    if (!postId || !content || !userId) {
      throw new BadRequestException(
        'postId, content, and userId are required.',
      );
    }

    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      throw new NotFoundException('Post not found.');
    }

    const comment: CommentEntity = {
      id: uuidv4(),
      userId,
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    const postData = postSnap.data();
    const comments = Array.isArray(postData?.comments) ? postData.comments : [];
    comments.push(comment);

    await postRef.update({
      comments,
      commentsCount: (postData?.commentsCount || 0) + 1,
    });

    return { comment };
  }

  //   async createReply(dto: CreateReplyDto, userId: string) {
  //     const { postId, commentId, content } = dto;
  //     if (!postId || !commentId || !content || !userId) {
  //       throw new BadRequestException(
  //         'postId, commentId, content, and userId are required.',
  //       );
  //     }
  //     const postRef = this.collection.doc(postId);
  //     const postSnap = await postRef.get();
  //     if (!postSnap.exists) {
  //       throw new NotFoundException('Post not found.');
  //     }
  //     const postData = postSnap.data();
  //     if (!postData || !Array.isArray(postData.comments)) {
  //       throw new BadRequestException('Post has no comments array.');
  //     }
  //     const comments = postData.comments;
  //     const idx = comments.findIndex((c: any) => c.id === commentId);
  //     if (idx === -1) {
  //       throw new NotFoundException('Comment not found.');
  //     }
  //     const reply: CommentReplyEntity = {
  //       userId,
  //       content,
  //       createdAt: new Date().toISOString(),
  //     };
  //     comments[idx].replies = Array.isArray(comments[idx].replies)
  //       ? comments[idx].replies
  //       : [];
  //     comments[idx].replies.push(reply);
  //     await postRef.update({ comments });
  //     return { reply };
  //   }
}
