import { SignUpForm } from "@/components/auth/sign-up-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function SignUpPage() {
  return (
    <AuthLayout title="Create an account" subtitle="Sign up to get started">
      <SignUpForm />
    </AuthLayout>
  );
}
