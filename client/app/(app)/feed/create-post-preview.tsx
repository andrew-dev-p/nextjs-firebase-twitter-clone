"use client";

import type { PostEntity } from "@/types/entities";
import MovingText from "@/components/ui/moving-text";
import { PostCard } from "@/components/post-card/post-card";

interface CreatePostPreviewProps {
  post: PostEntity;
}

export function CreatePostPreview({ post }: CreatePostPreviewProps) {
  return (
    <div className="rounded-lg border p-4">
      <MovingText text="Looking good already!" />
      <PostCard post={post} isPreview />
    </div>
  );
}
