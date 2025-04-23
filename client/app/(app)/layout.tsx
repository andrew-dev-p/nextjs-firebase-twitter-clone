"use client";

import { useEffect, type ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuthStore((state) => state);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (error || !user) {
      router.replace("/");
    }
  }, [user, loading, error, router]);

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
