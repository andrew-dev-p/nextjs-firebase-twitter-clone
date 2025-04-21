"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { CreatePostModal } from "./create-post-modal";
import { PostCard } from "@/components/post/post-card";
import { motion } from "framer-motion";
import { useQueryPosts } from "@/hooks/use-query-posts";
import { useMutatePosts } from "@/hooks/use-mutate-posts";
import { auth } from "@/firebase/auth";

export default function FeedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: posts = [], isLoading } = useQueryPosts();
  const { create } = useMutatePosts();

  const handleCreatePost = async ({
    title,
    description,
    photoUrl,
  }: {
    title: string;
    description: string;
    photoUrl?: string;
  }) => {
    setIsModalOpen(false);
    const user = auth.currentUser;
    if (!user) return;
    await create({
      title,
      description,
      photoUrl,
      userId: user.uid,
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 pt-20">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Feed</h1>
          <motion.div
            className="relative inline-block"
            initial={{}}
            animate={{}}
            whileHover={{ scale: 1.08 }}
          >
            <motion.div
              className="absolute inset-0 rounded-full z-0"
              style={{
                boxShadow: "0 0 0 0 rgba(29,155,209,0.6)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(29,155,209,0.6)",
                  "0 0 8px 4px rgba(29,155,209,0.8)",
                ],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="relative z-10 flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Post
            </Button>
          </motion.div>
        </div>

        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreatePost={handleCreatePost}
        />

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
            posts.map((post) => <PostCard key={post.title} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}
