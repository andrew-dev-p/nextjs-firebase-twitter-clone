"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const route = useRouter();

  useEffect(() => {
    if (user) {
      route.push("/feed");
    }
  }, [route, user]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started with your account
          </p>
        </div>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
