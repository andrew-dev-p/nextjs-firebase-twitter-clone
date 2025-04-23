"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import type { PostEntity } from "@/types/entities";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().optional(),
});

type PostSchema = z.infer<typeof postSchema>;

interface EditPostDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: PostEntity;
  onEditPost: (post: PostEntity) => Promise<PostEntity>;
}

export function EditPostDialog({
  isOpen,
  onClose,
  post,
  onEditPost,
}: EditPostDialogProps) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      photoUrl: post.photoUrl,
    },
  });

  useEffect(() => {
    form.reset({
      title: post.title,
      description: post.description,
      photoUrl: post.photoUrl,
    });
  }, [post, form]);

  const onSubmit = async (values: PostSchema) => {
    setUploading(true);
    try {
      await onEditPost(values as PostEntity);
      toast.success("Post updated successfully");
      onClose();
    } catch {
      toast.error("Failed to update post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter post description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter image URL (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
