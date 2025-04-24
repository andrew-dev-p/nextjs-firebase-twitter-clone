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
import { Label } from "../ui/label";
import { ImagePlus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadFileAndGetUrl } from "@/firebase/storage";
import Image from "next/image";

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
  onEditPost: (post: Partial<PostEntity>) => Promise<PostEntity>;
}

export function EditPostDialog({
  isOpen,
  onClose,
  post,
  onEditPost,
}: EditPostDialogProps) {
  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      description: post.description,
      photoUrl: post.photoUrl,
    },
  });

  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | undefined>(post.photoUrl);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
      form.setValue("photoUrl", URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    form.reset({
      title: post.title,
      description: post.description,
      photoUrl: post.photoUrl,
    });
  }, [post, form]);

  const mutation = useMutation({
    mutationFn: async (values: {
      title: string;
      description: string;
      photoUrl?: string;
    }) => {
      let uploadedPhotoUrl = values.photoUrl;
      if (imageFile) {
        const storagePath = `post-photos/${crypto.randomUUID()}-${
          imageFile.name
        }`;
        uploadedPhotoUrl = await uploadFileAndGetUrl(storagePath, imageFile);
      }
      await onEditPost({
        title: values.title,
        description: values.description,
        photoUrl: uploadedPhotoUrl,
      });
    },
    onSuccess: () => {
      form.reset();
      setImageFile(undefined);
      setImageUrl(undefined);
      onClose();
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
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
              render={() => (
                <FormItem>
                  <FormLabel>Image (optional)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {imageUrl ? (
                        <div className="relative rounded-md overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt="Post preview"
                            className="w-full h-48 object-cover"
                            width={480}
                            height={270}
                          />
                          <Button
                            className="absolute top-2 right-2"
                            variant="destructive"
                            type="button"
                            size="icon"
                            onClick={() => setImageUrl(undefined)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border border-dashed rounded-md p-8 text-center">
                          <Label
                            htmlFor="image-upload"
                            className="flex flex-col items-center gap-2 cursor-pointer"
                          >
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload an image
                            </span>
                            <Input
                              id="image-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageChange}
                            />
                          </Label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
