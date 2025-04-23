"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreatePostForm } from "./create-post-form";
import { CreatePostPreview } from "./create-post-preview";
import type { PostEntity } from "@/types/entities";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().optional(),
});

type PostSchema = z.infer<typeof postSchema>;

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export enum CreatePostTab {
  Creation = "creation",
  Preview = "preview",
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState<CreatePostTab>(
    CreatePostTab.Creation
  );

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", description: "", photoUrl: "" },
  });

  const previewPost: PostEntity = {
    id: "preview",
    userId: "me",
    title: form.getValues("title") || "Post title",
    description: form.getValues("description") || "Post description...",
    photoUrl: form.getValues("photoUrl"),
    likes: [],
    dislikes: [],
    commentsCount: 0,
    comments: [],
    createdAt: new Date().toISOString(),
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as CreatePostTab)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value={CreatePostTab.Creation}>Creation</TabsTrigger>
            <TabsTrigger value={CreatePostTab.Preview}>Preview</TabsTrigger>
          </TabsList>
          <TabsContent value={CreatePostTab.Creation}>
            {activeTab === CreatePostTab.Creation ? (
              <CreatePostForm form={form} onSuccess={onClose} />
            ) : (
              <CreatePostPreview post={previewPost} />
            )}
          </TabsContent>
          <TabsContent value={CreatePostTab.Preview}>
            <CreatePostPreview post={previewPost} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
