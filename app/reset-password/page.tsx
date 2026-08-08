import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/PasswordRecoveryForms";
import { Card, CardBody } from "@/components/ui/Card";

export const metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return <div className="mx-auto flex min-h-screen max-w-md items-center px-4 py-12"><Card className="w-full"><CardBody className="py-8"><Suspense fallback={null}><ResetPasswordForm /></Suspense></CardBody></Card></div>;
}
