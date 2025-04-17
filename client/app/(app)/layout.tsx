"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { ToastContainer } from "react-toastify";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastContainer />
      <Navbar />
      {children}
    </>
  );
}
