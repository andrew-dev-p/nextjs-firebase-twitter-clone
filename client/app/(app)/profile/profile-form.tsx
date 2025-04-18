"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { ProfilePhotoPicker } from "@/components/profile-photo-picker/profile-photo-picker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUserInDb } from "@/firebase/db";
import { updateUserEmail } from "@/firebase/auth";
import { auth } from "@/firebase/auth";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  profilePhoto: z
    .string()
    .url({ message: "Profile photo is required" })
    .optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      email: "",
      profilePhoto: "",
    },
  });

  const userInfo = useCurrentUser();

  useEffect(() => {
    if (userInfo) {
      form.reset({
        username: userInfo.username,
        email: userInfo.email,
        profilePhoto: userInfo.profilePhotoUrl || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  const onSubmit = async (values: ProfileSchema) => {
    setIsLoading(true);
    try {
      await updateUserEmail(values.email);

      const currentUser = auth.currentUser;
      if (currentUser) {
        await updateUserInDb({
          uid: currentUser.uid,
          username: values.username,
          email: values.email,
          profilePhotoUrl: values.profilePhoto,
        });
      }
      toast("Profile updated successfully");
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to update profile. Please try again.";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center mb-6">
          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field }) => (
              <ProfilePhotoPicker
                onPhotoSelect={field.onChange}
                selectedPhoto={field.value}
              />
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="username" />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.username?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} autoComplete="email" />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
