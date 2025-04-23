"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  auth,
  signInWithGoogle,
} from "@/firebase/auth";
import { createUserInDb } from "@/firebase/db";
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
import { toast } from "react-toastify";
import { ProfilePhotoPicker } from "@/components/profile-photo-picker/profile-photo-picker";
import { useMutation } from "@tanstack/react-query";

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  profilePhoto: z
    .string()
    .url({ message: "Profile photo is required" })
    .optional(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      profilePhoto: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: SignUpSchema) => {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      await createUserInDb({
        uid: userCredential.user.uid,
        username: values.username,
        email: values.email,
        profilePhotoUrl: values.profilePhoto || "",
      });
      await sendEmailVerification(userCredential.user);
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/verify-email");
    },
    onError: () => {
      setError("Failed to create account. Please try again.");
    },
  });

  const onSubmit = async (values: SignUpSchema) => {
    setError("");
    mutation.mutate(values);
  };

  const googleMutation = useMutation({
    mutationFn: async () => {
      const googleResult = await signInWithGoogle();
      if (googleResult?.user) {
        await createUserInDb({
          uid: googleResult.user.uid,
          username: googleResult.user.displayName || "",
          email: googleResult.user.email || "",
          profilePhotoUrl: googleResult.user.photoURL || "",
        });
      }
    },
    onSuccess: () => {
      toast.success("Logged in with Google");
      router.push("/feed");
    },
    onError: () => {
      setError("Google authentication failed");
    },
  });

  const handleGoogleSignup = async () => {
    setError("");
    googleMutation.mutate();
  };

  return (
    <div className="mt-6 space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="profilePhoto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Photo</FormLabel>
                <ProfilePhotoPicker
                  onPhotoSelect={(url) => field.onChange(url)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="username"
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
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
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating account..." : "Sign up"}
          </Button>
        </form>
      </Form>
      <Separator />
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignup}
        className="w-full"
        disabled={googleMutation.isPending}
      >
        {googleMutation.isPending ? (
          <svg
            className="animate-spin h-5 w-5 mr-2 inline"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.313 2.687 6 6 6v-1.709z"
            />
          </svg>
        ) : null}
        Sign up with Google
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-4 hover:text-primary"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
