"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/react-query";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";
import { ThemeProvider } from "next-themes";

const Providers = ({ children }: PropsWithChildren) => {
  useFirebaseAuth();

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
