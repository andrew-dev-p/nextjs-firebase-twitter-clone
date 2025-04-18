export interface UserEntity {
  id: string;
  username: string;
  email: string;
  profilePhotoUrl?: string;
  createdAt: string;
}

export interface PostEntity {
  id: string;
  userId: string;
  title: string;
  description?: string;
  photoUrl?: string;
  likes: string[];
  dislikes: string[];
  commentsCount: number;
  comments: CommentEntity[];
  createdAt: string;
}

export interface CommentEntity {
  id: string;
  userId: string;
  content: string;
  replies: CommentReplyEntity[];
  createdAt: string;
}

export interface CommentReplyEntity {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}
