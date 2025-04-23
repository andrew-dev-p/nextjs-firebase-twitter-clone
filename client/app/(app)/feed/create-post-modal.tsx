"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { X } from "lucide-react";
import { PostEntity } from "@/types/entities";
import { PostCard } from "@/components/post/post-card";
import { uploadFileAndGetUrl } from "@/firebase/storage";
import { ImagePlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: ({
    title,
    description,
    photoUrl,
  }: {
    title: string;
    description: string;
    photoUrl?: string;
  }) => void;
}

export enum CreatePostTab {
  Creation = "creation",
  Preview = "preview",
}

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  photoUrl: z.string().optional(),
});

type PostSchema = z.infer<typeof postSchema>;

export function CreatePostModal({
  isOpen,
  onClose,
  onCreatePost,
}: CreatePostModalProps) {
  const [activeTab, setActiveTab] = useState<CreatePostTab>(
    CreatePostTab.Creation
  );
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  const form = useForm<PostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      description: "",
      photoUrl: undefined,
    },
  });

  const watchPhoto = form.watch("photoUrl");

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (watchPhoto && typeof watchPhoto === "string") {
      setImageUrl(watchPhoto);
    } else {
      setImageUrl(undefined);
    }
  }, [imageFile, watchPhoto]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const removeImage = () => {
    setImageUrl(undefined);
    setImageFile(undefined);
    form.setValue("photoUrl", undefined);
  };

  const onSubmit = async (values: PostSchema) => {
    setUploading(true);
    let uploadedPhotoUrl = values.photoUrl;
    if (imageFile) {
      try {
        const storagePath = `post-photos/${crypto.randomUUID()}-${
          imageFile.name
        }`;
        uploadedPhotoUrl = await uploadFileAndGetUrl(storagePath, imageFile);
      } catch {
        toast.error("Failed to upload image. Please try again.");
        setUploading(false);
        return;
      }
    }
    setUploading(false);
    onCreatePost({
      title: values.title,
      description: values.description,
      photoUrl: uploadedPhotoUrl,
    });
    toast.success("Post created successfully");
    form.reset();
    setImageUrl(undefined);
    setImageFile(undefined);
    setActiveTab(CreatePostTab.Creation);
    onClose();
  };

  const previewPost: PostEntity = {
    id: "preview",
    userId: "me",
    title: form.getValues("title") || "Post title",
    description: form.getValues("description") || "Post description preview...",
    photoUrl: imageUrl,
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
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
                        <Textarea
                          placeholder="Write your post description here..."
                          className="min-h-[150px]"
                          {...field}
                        />
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
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={removeImage}
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
                <Button type="submit" className="w-full" disabled={uploading}>
                  {uploading ? "Uploading..." : "Create Post"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value={CreatePostTab.Preview}>
            <div className="rounded-lg border p-4">
              <div className="text-center mb-2 font-bold text-lg bg-gradient-to-r from-blue-700 to-blue-300 bg-clip-text text-transparent flex justify-center gap-0.5">
                {"Looking good already!".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 0 }}
                    animate={{ y: [0, -1, 0] }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.75,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </div>
              <PostCard post={previewPost} isPreview />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
