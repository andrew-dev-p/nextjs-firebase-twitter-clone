import { CommentEntity } from "@/types/entities";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import CommentReplyCard from "./comment-reply-card";
import { useQuery } from "@tanstack/react-query";
import { getUserFromDb } from "@/firebase/db";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Send, X } from "lucide-react";
import { useMutateReplies } from "@/hooks/use-mutate-replies";

const CommentCard = ({
  comment,
  postId,
}: {
  comment: CommentEntity;
  postId: string;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const { create } = useMutateReplies();

  const handleAddReply = () => {
    if (!replyText.trim()) return;
    create({
      postId,
      commentId: comment.id,
      content: replyText,
    });
    setReplyText("");
  };

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
      <div className="flex justify-between">
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
        <Button
          onClick={() => setIsReplying((prev) => !prev)}
          variant="link"
          size="sm"
          className="text-muted-foreground"
        >
          Reply
        </Button>
      </div>
      <p className="text-sm pl-8">{comment.content}</p>
      {isReplying && (
        <div className="flex gap-2 mt-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[36px]"
          />
          <Button
            size="icon"
            onClick={handleAddReply}
            disabled={!replyText.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setIsReplying(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
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
