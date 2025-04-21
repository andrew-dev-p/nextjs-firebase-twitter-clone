"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ToastContainer } from "react-toastify";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/react-query";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Navbar />
      {children}
    </QueryClientProvider>
  );
}
