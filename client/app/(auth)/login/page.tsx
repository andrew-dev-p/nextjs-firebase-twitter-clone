import { LoginForm } from "@/app/(auth)/login/login-form";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to your account">
      <LoginForm />
    </AuthLayout>
  );
}
