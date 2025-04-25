"use client";

import { useState } from "react";
import { getUserFromDb } from "@/firebase/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FullscreenIcon, MessageSquare } from "lucide-react";
import { PostEntity } from "@/types/entities";
import { useQuery } from "@tanstack/react-query";
import type { UserEntity } from "@/types/entities";
import { QueryKey } from "@/lib/constants";
import { useAuthStore } from "@/stores/auth-store";
import { EditPostDialog } from "@/components/post-card/edit-post-dialog";
import { DeletePostDialog } from "@/components/post-card/delete-post-dialog";
import { useMutatePosts } from "@/hooks/use-mutate-posts";
import { PostCardHeader } from "./post-card-header";
import { PostCardActions } from "./post-card-actions";
import CommentSection from "./comment-section";
import { cn } from "@/lib/utils";
import PostCardVotes from "./post-card-votes";
import { ImageModal } from "../ui/image-modal";

interface PostCardProps {
  post: PostEntity;
  isPreview?: boolean;
}

export function PostCard({ post, isPreview = false }: PostCardProps) {
  const [isViewingComments, setIsViewingComments] = useState(false);

  const currentUser = useAuthStore((state) => state.user);

  const {
    data: author,
    isLoading: authorLoading,
    isError: authorError,
  } = useQuery<UserEntity | null>({
    queryKey: [QueryKey.USER, post.userId],
    queryFn: () => getUserFromDb(post.userId),
    enabled: !!post.userId && !isPreview,
  });

  const { update, remove } = useMutatePosts();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <Card className="overflow-hidden max-w-2xl w-full py-3 gap-2">
      <PostCardActions
        isOwner={post.userId === currentUser?.id}
        onEdit={() => setEditDialogOpen(true)}
        onDelete={() => setDeleteDialogOpen(true)}
      />
      {post.photoUrl && (
        <div className="relative w-full h-64 overflow-hidden p-2 rounded-lg">
          <ImageModal imageUrl={post.photoUrl} alt={post.title} />
          <Button
            variant="outline"
            size="icon"
            className="pointer-events-none absolute top-3 right-1/2 translate-x-1/2"
          >
            <FullscreenIcon />
          </Button>
        </div>
      )}
      <PostCardHeader
        isPreview={isPreview}
        currentUser={currentUser}
        author={author}
        authorLoading={authorLoading}
        authorError={authorError}
        post={post}
      />
      <CardContent className="space-y-2 px-3">
        <p className="text-xl font-semibold">{post.title} </p>
        <p className="whitespace-pre-line">{post.description}</p>
      </CardContent>
      {!isPreview && (
        <CardFooter className="flex flex-col items-start pt-0 w-full">
          <div className="flex justify-around items-center gap-4 w-full">
            <PostCardVotes post={post} />
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-3"
              onClick={() => setIsViewingComments(!isViewingComments)}
            >
              <MessageSquare
                className={cn(
                  "h-4 w-4 transition",
                  isViewingComments ? "text-blue-500 rotate-0" : "rotate-360"
                )}
              />
              <span
                className={cn("text-sm", isViewingComments && "text-blue-500")}
              >
                {post.commentsCount} Comments
              </span>
            </Button>
          </div>
          <CommentSection
            isViewingComments={isViewingComments}
            postId={post.id}
            comments={post.comments || []}
          />
        </CardFooter>
      )}
      <EditPostDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        post={post}
        onEditPost={(data) => update({ id: post.id, update: data })}
      />
      <DeletePostDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={() => remove(post.id)}
      />
    </Card>
  );
}
