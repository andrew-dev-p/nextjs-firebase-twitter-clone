"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/feed");
    }
  }, [isLoggedIn, router]);

  return <>{children}</>;
}
