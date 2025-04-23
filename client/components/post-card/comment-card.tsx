import { CommentEntity } from "@/types/entities";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import CommentReplyCard from "./comment-reply-card";

const CommentCard = ({ comment }: { comment: CommentEntity }) => {
  return (
    <div key={comment.id} className="border-t pt-4">
      <div className="flex items-center gap-2 mb-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <span className="font-semibold">Anonymous</span>
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
            <CommentReplyCard key={reply.id} reply={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
