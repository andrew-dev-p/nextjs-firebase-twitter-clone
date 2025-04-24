import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateReplyDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  replyId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
