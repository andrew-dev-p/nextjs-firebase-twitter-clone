import { CommentReplyEntity } from "@/types/entities";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getUserFromDb } from "@/firebase/db";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";

const CommentReplyCard = ({ reply }: { reply: CommentReplyEntity }) => {
  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<UserEntity | null>({
    queryKey: [QueryKey.USER, reply.userId],
    queryFn: () => getUserFromDb(reply.userId),
    enabled: !!reply.userId,
  });

  return (
    <div key={reply.id} className="flex items-start gap-2">
      <Avatar className="h-5 w-5 mt-1">
        <AvatarImage src={author?.profilePhotoUrl} />
        <AvatarFallback>
          {author?.username?.[0]?.toUpperCase() || "A"}
        </AvatarFallback>
      </Avatar>
      <div>
        <span className="font-semibold text-xs">
          {authorLoading
            ? "..."
            : author?.username || (authorError ? "Unknown" : "Anonymous")}
        </span>
        <span className="ml-2 text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(reply.createdAt), {
            addSuffix: true,
          })}
        </span>
        <div className="text-xs">{reply.content}</div>
      </div>
    </div>
  );
};

export default CommentReplyCard;
