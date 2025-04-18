"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PostEntity } from "@/types/entities";
import { CreatePostModal } from "./create-post-modal";
import { PostCard } from "@/components/post/post-card";

export default function FeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = (
    newPost: Pick<PostEntity, "title" | "description" | "photoUrl">
  ) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pt-20">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Create Post
          </Button>
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreatePost={handleCreatePost}
        />

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
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
      </div>
    </div>
  );
}
