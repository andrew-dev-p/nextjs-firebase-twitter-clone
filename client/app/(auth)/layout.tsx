"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.replace("/feed");
    }
  }, [user, router]);

  return children;
}
