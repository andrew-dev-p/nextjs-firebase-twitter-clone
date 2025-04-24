import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { firestore } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { CommentEntity, CommentReplyEntity } from '../types/entities';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { DeleteCommentDto } from './dto/delete-comment.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { DeleteReplyDto } from './dto/delete-reply.dto';

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

  async createReply(dto: CreateReplyDto, userId: string) {
    const { postId, commentId, content } = dto;
    if (!postId || !commentId || !content || !userId) {
      throw new BadRequestException(
        'postId, commentId, content, and userId are required.',
      );
    }

    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) {
      throw new NotFoundException('Post not found.');
    }

    const postData = postSnap.data();
    if (!postData || !Array.isArray(postData.comments)) {
      throw new BadRequestException('Post has no comments array.');
    }

    const comments = postData.comments as CommentEntity[];
    const idx = comments.findIndex(
      (comment: CommentEntity) => comment.id === commentId,
    );
    if (idx === -1) {
      throw new NotFoundException('Comment not found.');
    }

    const reply: CommentReplyEntity = {
      id: uuidv4(),
      userId,
      content,
      createdAt: new Date().toISOString(),
    };

    comments[idx].replies = Array.isArray(comments[idx].replies)
      ? comments[idx].replies
      : [];
    comments[idx].replies.push(reply);

    await postRef.update({ comments });

    return { reply };
  }

  async updateComment(dto: UpdateCommentDto, userId: string) {
    const { postId, commentId, content } = dto;
    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) throw new NotFoundException('Post not found.');

    const postData = postSnap.data();
    if (!postData || !Array.isArray(postData.comments))
      throw new BadRequestException('Post has no comments array.');

    const comments = postData.comments as CommentEntity[];
    const idx = comments.findIndex(
      (c: CommentEntity) => c.id === commentId && c.userId === userId,
    );
    if (idx === -1)
      throw new NotFoundException('Comment not found or not owned by user.');

    comments[idx].content = content;

    await postRef.update({ comments });

    return { comment: comments[idx] };
  }

  async deleteComment(dto: DeleteCommentDto, userId: string) {
    const { postId, commentId } = dto;
    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) throw new NotFoundException('Post not found.');

    const postData = postSnap.data();
    if (!postData || !Array.isArray(postData.comments))
      throw new BadRequestException('Post has no comments array.');

    const comments = postData.comments as CommentEntity[];
    const idx = comments.findIndex(
      (c: CommentEntity) => c.id === commentId && c.userId === userId,
    );
    if (idx === -1)
      throw new NotFoundException('Comment not found or not owned by user.');

    comments.splice(idx, 1);

    await postRef.update({ comments });

    return { success: true };
  }

  async updateReply(dto: UpdateReplyDto, userId: string) {
    const { postId, commentId, replyId, content } = dto;
    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) throw new NotFoundException('Post not found.');

    const postData = postSnap.data();
    if (!postData || !Array.isArray(postData.comments))
      throw new BadRequestException('Post has no comments array.');

    const comments = postData.comments as CommentEntity[];
    const commentIdx = comments.findIndex(
      (c: CommentEntity) => c.id === commentId,
    );
    if (commentIdx === -1) throw new NotFoundException('Comment not found.');

    const replies = comments[commentIdx].replies;
    const replyIdx = replies.findIndex(
      (r: CommentReplyEntity) => r.id === replyId && r.userId === userId,
    );
    if (replyIdx === -1)
      throw new NotFoundException('Reply not found or not owned by user.');

    replies[replyIdx].content = content;

    await postRef.update({ comments });

    return { reply: replies[replyIdx] };
  }

  async deleteReply(dto: DeleteReplyDto, userId: string) {
    const { postId, commentId, replyId } = dto;
    const postRef = this.collection.doc(postId);
    const postSnap = await postRef.get();
    if (!postSnap.exists) throw new NotFoundException('Post not found.');

    const postData = postSnap.data();
    if (!postData || !Array.isArray(postData.comments))
      throw new BadRequestException('Post has no comments array.');

    const comments = postData.comments as CommentEntity[];
    const commentIdx = comments.findIndex(
      (c: CommentEntity) => c.id === commentId,
    );
    if (commentIdx === -1) throw new NotFoundException('Comment not found.');

    const replies = comments[commentIdx].replies;
    const replyIdx = replies.findIndex(
      (r: CommentReplyEntity) => r.id === replyId && r.userId === userId,
    );
    if (replyIdx === -1)
      throw new NotFoundException('Reply not found or not owned by user.');

    replies.splice(replyIdx, 1);

    await postRef.update({ comments });

    return { success: true };
  }
}
