export interface UserEntity {
  uid: string;
  username: string;
  email: string;
  profilePhotoUrl?: string;
  createdAt: string;
}

export class CommentReplyEntity {
  userId: string;
  content: string;
  createdAt: string;
}

export class CommentEntity {
  id: string;
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
