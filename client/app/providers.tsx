"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { queryClient } from "@/lib/react-query";
import { useFirebaseAuth } from "@/hooks/use-firebase-auth";

const Providers = ({ children }: PropsWithChildren) => {
  useFirebaseAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
