import { CommentEntity } from "@/types/entities";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import CommentReplyCard from "./comment-reply-card";
import { useQuery } from "@tanstack/react-query";
import { getUserFromDb } from "@/firebase/db";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";

const CommentCard = ({ comment }: { comment: CommentEntity }) => {
  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<UserEntity | null>({
    queryKey: [QueryKey.USER, comment.userId],
    queryFn: () => getUserFromDb(comment.userId),
    enabled: !!comment.userId,
  });

  return (
    <div key={comment.id} className="border-t pt-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={author?.profilePhotoUrl} />
          <AvatarFallback>
            {author?.username?.[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold mb-0.5">
          {authorLoading
            ? "..."
            : author?.username || (authorError ? "Unknown" : "Anonymous")}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(comment.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <p className="text-sm pl-8">{comment.content}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-10 mt-2 space-y-2 border-l border-muted-foreground/20 pl-4">
          {comment.replies.map((reply) => (
            <CommentReplyCard key={reply.userId} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
