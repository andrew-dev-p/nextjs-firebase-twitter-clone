import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteReplyDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  replyId: string;
}
