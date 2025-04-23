"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { CreatePostModal } from "./create-post-modal";
import { useQueryPosts } from "@/hooks/use-query-posts";
import { GlowingButton } from "./glowing-button";
import { Posts } from "./posts";

export default function FeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: posts = [], isLoading } = useQueryPosts();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pt-20">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed</h1>
          <GlowingButton onClick={() => setIsModalOpen(true)}>
            <PlusCircle className="h-4 w-4" />
            Create Post
          </GlowingButton>
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

        <div className="space-y-6 flex flex-col items-center">
          <Posts
            isLoading={isLoading}
            posts={posts}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
    </div>
  );
}
