export class CommentReplyEntity {
  userId: string;
  content: string;
  createdAt: string;
}

export class CommentEntity {
  userId: string;
  content: string;
  createdAt: string;
  replies: CommentReplyEntity[];
}

export class PostEntity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  photoUrl?: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  comments: CommentEntity[];
}
