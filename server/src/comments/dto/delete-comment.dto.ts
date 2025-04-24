import { IsString, IsNotEmpty } from 'class-validator';

export class DeleteCommentDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsString()
  @IsNotEmpty()
  commentId: string;
}
