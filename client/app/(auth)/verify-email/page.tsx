import { AuthLayout } from "@/components/layout/auth-layout";
import { EmailVerification } from "./email-verification";

export default function VerifyEmailPage() {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="We've sent you a verification email"
    >
      <EmailVerification />
    </AuthLayout>
  );
}
