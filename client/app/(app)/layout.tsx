"use client";

import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { checkEmailVerification } from "@/firebase/auth";

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, error } = useAuthStore((state) => state);

  useEffect(() => {
    if (loading) return;
    if (error || !user) {
      router.replace("/");
      return;
    }

    checkEmailVerification().then((isVerified) => {
      if (!isVerified) {
        router.replace("/email-not-verified");
      }
    });
  }, [user, loading, error, router]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
