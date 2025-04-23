import { CommentReplyEntity } from "@/types/entities";
import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";

const CommentReplyCard = ({ reply }: { reply: CommentReplyEntity }) => {
  return (
    <div key={reply.id} className="flex items-start gap-2">
      <Avatar className="h-5 w-5 mt-1">
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
      <div>
        <span className="font-semibold text-xs">Anonymous</span>
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
