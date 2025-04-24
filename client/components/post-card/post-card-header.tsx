import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { UserEntity, PostEntity } from "@/types/entities";
import type { FC } from "react";
import { UserState } from "@/stores/auth-store";
import Link from "next/link";

interface PostCardHeaderProps {
  isPreview: boolean;
  currentUser: UserState;
  author: UserEntity | null | undefined;
  authorLoading: boolean;
  authorError: boolean;
  post: PostEntity;
}

export const PostCardHeader: FC<PostCardHeaderProps> = ({
  isPreview,
  currentUser,
  author,
  authorLoading,
  authorError,
  post,
}) => {
  const authorName = isPreview
    ? currentUser?.username
    : author
    ? author.username
    : authorLoading
    ? "Loading..."
    : authorError
    ? "Error"
    : "Anonymous";

  const authorAvatar = isPreview ? (
    <AvatarImage src={currentUser?.profilePhotoUrl || ""} />
  ) : authorLoading ? (
    <AvatarFallback>...</AvatarFallback>
  ) : author && author.profilePhotoUrl ? (
    <AvatarImage src={author.profilePhotoUrl} />
  ) : (
    <AvatarFallback>{authorName?.[0]?.toUpperCase()}</AvatarFallback>
  );

  return (
    <div className="flex flex-row items-center gap-4 px-3">
      <Link href={`/profile/${post.userId}`}>
        <Avatar className="mt-1">{authorAvatar}</Avatar>
      </Link>
      <div>
        <Link href={`/profile/${post.userId}`}>
          <div className="font-semibold text-base hover:underline">
            {authorName}
          </div>
        </Link>
        <div className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
          })}
        </div>
      </div>
    </div>
  );
};
