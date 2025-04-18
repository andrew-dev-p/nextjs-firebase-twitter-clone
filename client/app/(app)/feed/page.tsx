"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { PostEntity } from "@/types/entities";
import { CreatePostModal } from "./create-post-modal";
import { PostCard } from "@/components/post/post-card";
import { motion } from "framer-motion";

export default function FeedPage() {
  const [posts, setPosts] = useState<PostEntity[]>([
    {
      id: "post_001",
      userId: "user_123",
      title:
        "Just finished reading 'The 48 Laws of Power' — it's wild how much psychology is behind influence. Law 3 really hit me: conceal your intentions.",
      description:
        "Just finished reading 'The 48 Laws of Power' — it's wild how much psychology is behind influence. Law 3 really hit me: conceal your intentions.",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/twitteritto-bandito.firebasestorage.app/o/profile-photos%2Ff3c4184c-cb68-46b7-a920-fb67fbc52dc4-logo.ico?alt=media&token=9756697b-a0ef-425c-a820-bace13436c9f",
      createdAt: "2025-04-18T10:32:00Z",
      likes: ["user_234", "user_345", "user_456"],
      dislikes: ["user_567"],
      comments: [
        {
          id: "comment_001",
          userId: "user_234",
          content:
            "That one changed my perspective too. It's scary how relevant it is in daily life.",
          createdAt: "2025-04-18T11:00:00Z",
        },
        {
          id: "comment_002",
          userId: "user_678",
          content:
            "I prefer Law 6 — 'Court attention at all cost.' Makes sense in today’s world.",
          createdAt: "2025-04-18T11:10:00Z",
        },
      ],
      commentsCount: 2,
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatePost = (
    newPost: Pick<PostEntity, "title" | "description" | "photoUrl">
  ) => {
    setIsModalOpen(false);
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
