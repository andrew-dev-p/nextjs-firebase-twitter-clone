"use client";

import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post-card/post-card";
import type { FC } from "react";
import type { PostEntity } from "@/types/entities";
import PostCardSkeleton from "@/components/post-card/post-card-skeleton";

interface PostsProps {
  isLoading: boolean;
  posts: PostEntity[];
  setIsModalOpen?: (open: boolean) => void;
  isViewOnly?: boolean;
}

export const Posts: FC<PostsProps> = ({
  isLoading,
  posts,
  setIsModalOpen,
  isViewOnly,
}) => {
  return (
    <div className="space-y-6 flex flex-col items-center w-full">
      {isLoading ? (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      ) : posts.length === 0 ? (
        <div className="w-full rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          {isViewOnly && (
            <>
              <p className="text-muted-foreground mb-4">
                Create your first post to get started!
              </p>
              <Button onClick={() => setIsModalOpen?.(true)}>
                Create Post
              </Button>
            </>
          )}
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};
