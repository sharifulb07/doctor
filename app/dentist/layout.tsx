import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";
import { UserRole } from "@/types";

export const metadata: Metadata = { title: "Dentist Dashboard" };
export const dynamic = "force-dynamic";

export default async function DentistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuth();

  if (!auth) {
    redirect("/login?redirect=/dentist");
  }

  if (auth.role === UserRole.ADMIN) {
    redirect("/admin");
  }

  if (auth.role !== UserRole.DENTIST) {
    redirect("/");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Dentist Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your schedule and availability slots
          </p>
        </div>
        <Link href="/" className="text-sm text-sky-600 hover:underline">
          ← Back to site
        </Link>
      </div>
      {children}
    </div>
  );
}
