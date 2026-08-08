import { ForgotPasswordForm } from "@/components/auth/PasswordRecoveryForms";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12"><Card className="w-full"><CardBody className="py-8"><ForgotPasswordForm /></CardBody></Card></div>;
}
