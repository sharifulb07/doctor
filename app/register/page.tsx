import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardBody } from "@/components/ui/Card";
import RegisterPageHeading from "@/components/auth/RegisterPageHeading";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a free EasyDentalSolution account and book your first dental appointment.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <RegisterPageHeading />
        <Card>
          <CardBody className="py-8">
            <RegisterForm />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
