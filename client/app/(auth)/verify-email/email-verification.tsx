"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  resendVerificationEmail,
  checkEmailVerification,
} from "@/firebase/auth";

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

  const handleResend = async () => {
    try {
      setIsResendDisabled(true);
      await resendVerificationEmail();
    } catch {
      setError("Failed to resend verification email. Please try again.");
      setIsResendDisabled(false);
    }
  };

  const handleContinue = async () => {
    try {
      setIsChecking(true);
      const isVerified = await checkEmailVerification();

      if (isVerified) {
        router.push("/dashboard");
      } else {
        setError(
          "Your email is not verified yet. Please check your inbox and click the verification link."
        );
      }
    } catch {
      setError("Failed to check verification status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

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
          onClick={handleResend}
          variant="outline"
          className="w-full"
          disabled={isResendDisabled}
        >
          {isResendDisabled
            ? `Resend available in ${countdown}s`
            : "Resend verification email"}
        </Button>

        <Button
          onClick={handleContinue}
          className="w-full"
          disabled={isChecking}
        >
          {isChecking ? "Checking..." : "Continue"}
        </Button>
      </div>
    </div>
  );
}
