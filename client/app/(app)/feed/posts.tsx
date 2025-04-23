"use client";

import { Button } from "@/components/ui/button";
import { PostCard } from "@/components/post/post-card";
import type { FC } from "react";
import type { PostEntity } from "@/types/entities";

interface PostsProps {
  isLoading: boolean;
  posts: PostEntity[];
  setIsModalOpen: (open: boolean) => void;
}

export const Posts: FC<PostsProps> = ({ isLoading, posts, setIsModalOpen }) => {
  return (
    <div className="space-y-6 flex flex-col items-center">
      {isLoading ? (
        <div className="w-full rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        </div>
      ) : posts.length === 0 ? (
        <div className="w-full rounded-lg border p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No posts yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first post to get started!
          </p>
          <Button onClick={() => setIsModalOpen(true)}>Create Post</Button>
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
};
