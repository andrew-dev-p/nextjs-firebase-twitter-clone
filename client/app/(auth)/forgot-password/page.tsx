import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email to reset your password"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
