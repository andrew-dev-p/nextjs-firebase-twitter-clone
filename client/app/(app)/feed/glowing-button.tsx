"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GlowingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function GlowingButton({ children, ...props }: GlowingButtonProps) {
  return (
    <motion.div
      className="relative inline-block"
      initial={{}}
      animate={{}}
      whileHover={{ scale: 1.08 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full z-0"
        style={{
          boxShadow: "0 0 0 0 rgba(29,155,209,0.6)",
        }}
        animate={{
          boxShadow: [
            "0 0 0 0 rgba(29,155,209,0.6)",
            "0 0 8px 4px rgba(29,155,209,0.8)",
          ],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      />
      <Button
        {...props}
        className={
          "relative z-10 flex items-center gap-2 " + (props.className || "")
        }
      >
        {children}
      </Button>
    </motion.div>
  );
}
