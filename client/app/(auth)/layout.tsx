"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { checkEmailVerification } from "@/firebase/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        router.replace("/feed");
      }
    })();
  }, [user, router, pathname]);

  return children;
}
