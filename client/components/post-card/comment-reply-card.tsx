import { CommentReplyEntity } from "@/types/entities";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getUserFromDb } from "@/firebase/db";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "../ui/button";
import { Check, PencilIcon, TrashIcon } from "lucide-react";
import { useMutateReplies } from "@/hooks/use-mutate-replies";
import { Textarea } from "../ui/textarea";
import Link from "next/link";

const CommentReplyCard = ({
  postId,
  commentId,
  reply,
}: {
  postId: string;
  commentId: string;
  reply: CommentReplyEntity;
}) => {
  const user = useAuthStore((state) => state.user);

  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<UserEntity | null>({
    queryKey: [QueryKey.USER, reply.userId],
    queryFn: () => getUserFromDb(reply.userId),
    enabled: !!reply.userId,
  });

  const { update, remove } = useMutateReplies();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.content);

  return (
    <div className="flex justify-between gap-2">
      <div key={reply.id} className="flex items-start gap-2">
        <Link href={`/profile/${reply.userId}`}>
          <Avatar className="h-5 w-5 mt-1">
            <AvatarImage src={author?.profilePhotoUrl} />
            <AvatarFallback>
              {author?.username?.[0]?.toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <Link href={`/profile/${reply.userId}`}>
            <span className="font-semibold text-xs hover:underline">
              {authorLoading
                ? "..."
                : author?.username || (authorError ? "Unknown" : "Anonymous")}
            </span>
          </Link>
          <span className="ml-2 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(reply.createdAt), {
              addSuffix: true,
            })}
          </span>
          {isEditing ? (
            <div className="flex gap-2 mt-2">
              <Textarea
                placeholder="Edit your comment..."
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[36px]"
              />
              <Button
                className="w-6 h-6"
                onClick={() => {
                  update({
                    postId,
                    commentId,
                    replyId: reply.id,
                    content: editText,
                  });
                  setIsEditing(false);
                }}
              >
                <Check />
              </Button>
            </div>
          ) : (
            <p className="text-xs">{reply.content}</p>
          )}
        </div>
      </div>
      {reply.userId === user?.id && (
        <div className="flex items-center gap-1">
          <Button
            className="w-6 h-6"
            onClick={() => setIsEditing((prev) => !prev)}
            variant="outline"
          >
            <PencilIcon />
          </Button>
          <Button
            className="w-6 h-6"
            onClick={() => remove({ postId, commentId, replyId: reply.id })}
            variant="destructive"
          >
            <TrashIcon />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentReplyCard;
