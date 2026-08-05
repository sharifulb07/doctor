import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Card, CardBody } from "@/components/ui/Card";
import LoginPageHeading from "@/components/auth/LoginPageHeading";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your DentalCare account to manage your appointments.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <LoginPageHeading />
        <Card>
          <CardBody className="py-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
