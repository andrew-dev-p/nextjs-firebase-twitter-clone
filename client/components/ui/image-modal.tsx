"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageModalProps {
  imageUrl: string;
  alt?: string;
  className?: string;
  thumbnailClassName?: string;
}

export function ImageModal({
  imageUrl,
  alt = "Image",
  className,
  thumbnailClassName,
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <div
        className={cn(
          "cursor-pointer overflow-hidden rounded-md",
          thumbnailClassName
        )}
        onClick={openModal}
      >
        <Image
          src={imageUrl}
          alt={alt}
          width={480}
          height={270}
          className={cn(
            "h-64 w-full object-cover transition-all hover:scale-105",
            className
          )}
        />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0"
            onClick={closeModal}
          />

          <div className="relative z-10 max-h-[90vh] max-w-[90vw] animate-in zoom-in-90">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={alt}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain"
            />

            <button
              className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
