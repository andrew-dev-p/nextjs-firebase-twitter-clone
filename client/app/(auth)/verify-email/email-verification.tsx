"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resendVerificationEmail,
  checkEmailVerification,
} from "@/firebase/auth";
import { useMutation } from "@tanstack/react-query";

export function EmailVerification() {
  const router = useRouter();

  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isResendDisabled && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
      setCountdown(30);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isResendDisabled, countdown]);

  const resendMutation = useMutation({
    mutationFn: async () => {
      await resendVerificationEmail();
    },
    onMutate: () => {
      setIsResendDisabled(true);
    },
    onError: () => {
      setError("Failed to resend verification email. Please try again.");
      setIsResendDisabled(false);
    },
  });

  const checkMutation = useMutation({
    mutationFn: async () => {
      return await checkEmailVerification();
    },
    onMutate: () => {
      setIsChecking(true);
    },
    onSuccess: (isVerified: boolean) => {
      if (isVerified) {
        router.push("/feed");
      } else {
        setError(
          "Your email is not verified yet. Please check your inbox and click the verification link."
        );
      }
    },
    onError: () => {
      setError("Failed to check verification status. Please try again.");
    },
    onSettled: () => {
      setIsChecking(false);
    },
  });

  return (
    <div className="mt-6 space-y-6">
      <Alert>
        <AlertDescription>
          We&apos;ve sent a verification email to your inbox. Please check your
          email and click the verification link.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Button
          onClick={() => resendMutation.mutate()}
          disabled={isResendDisabled || resendMutation.isPending}
          className="w-full"
        >
          {resendMutation.isPending
            ? "Resending..."
            : `Resend Email${isResendDisabled ? ` (${countdown})` : ""}`}
        </Button>

        <Button
          onClick={() => checkMutation.mutate()}
          disabled={isChecking || checkMutation.isPending}
          className="w-full"
        >
          {checkMutation.isPending ? "Checking..." : "I've Verified My Email"}
        </Button>
      </div>
    </div>
  );
}
