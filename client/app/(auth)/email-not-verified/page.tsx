"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MailWarning } from "lucide-react";

export default function EmailNotVerifiedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-4">
          <MailWarning className="h-12 w-12 text-yellow-500" />
          <h1 className="text-2xl font-bold text-center">Email Not Verified</h1>
          <Alert className="w-full">
            <AlertDescription className="text-yellow-500">
              Your email address has not been verified yet. Please check your
              inbox (and spam folder) for a verification link.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full mt-4">
            <Link href="/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
