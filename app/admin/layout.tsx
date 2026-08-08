import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";
import { UserRole } from "@/types";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await getServerAuth();
  if (!auth || auth.role !== UserRole.ADMIN) {
    redirect("/login");
  }

  const navItems = [
    { href: "/admin", label: "📊 Overview" },
    { href: "/admin/appointments", label: "📅 Appointments" },
    { href: "/admin/dentists", label: "👨‍⚕️ Dental Surgeons" },
    { href: "/admin/patients", label: "👥 Patients" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700">
          <p className="text-white font-bold text-lg">🦷 EasyDentalSolution</p>
          <p className="text-slate-400 text-xs mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-slate-700 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/" className="text-xs text-slate-400 hover:text-white">
            ← Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h1 className="font-semibold text-slate-900">Admin Dashboard</h1>
          <span className="text-sm text-slate-500">{auth.email}</span>
        </header>
        <main className="flex-1 p-6 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
