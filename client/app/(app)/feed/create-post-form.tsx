"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { uploadFileAndGetUrl } from "@/firebase/storage";
import Image from "next/image";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImagePlus, X } from "lucide-react";
import { useMutatePosts } from "@/hooks/use-mutate-posts";
import { auth } from "@/firebase/auth";

interface CreatePostFormProps {
  form: ReturnType<
    typeof useForm<{ title: string; description: string; photoUrl?: string }>
  >;
  onSuccess: () => void;
}

export function CreatePostForm({ form, onSuccess }: CreatePostFormProps) {
  const { create } = useMutatePosts();

  const [imageUrl, setImageUrl] = useState<string | undefined>(
    form.getValues("photoUrl")
  );
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setUploading(true);
      try {
        const storagePath = `post-photos/${crypto.randomUUID()}-${file.name}`;
        const uploadedUrl = await uploadFileAndGetUrl(storagePath, file);
        form.setValue("photoUrl", uploadedUrl);
        toast.success("Image uploaded!");
      } catch {
        toast.error("Failed to upload image. Try again.");
        setImageUrl(undefined);
        form.setValue("photoUrl", undefined);
      } finally {
        setUploading(false);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (values: {
      title: string;
      description: string;
      photoUrl?: string;
    }) => {
      if (!auth.currentUser?.uid) return;
      create({
        title: values.title,
        description: values.description,
        photoUrl: values.photoUrl,
        userId: auth.currentUser.uid,
      });
    },
    onSuccess: () => {
      form.reset();
      setImageUrl(undefined);
      onSuccess();
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });

  return (
    <FormProvider {...form}>
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
                        className="absolute top-2 right-2"
                        variant="destructive"
                        type="button"
                        size="icon"
                        onClick={() => {
                          setImageUrl(undefined);
                          form.setValue("photoUrl", undefined);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {uploading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
                          Uploading...
                        </div>
                      )}
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
                          disabled={uploading}
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
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Posting..." : "Create Post"}
        </Button>
      </form>
    </FormProvider>
  );
}
