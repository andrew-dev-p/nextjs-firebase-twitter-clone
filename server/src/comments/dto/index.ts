export interface CreateCommentDto {
  postId: string;
  content: string;
}

export interface CreateReplyDto {
  postId: string;
  commentId: string;
  content: string;
}
