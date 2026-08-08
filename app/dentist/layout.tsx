import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";
import { UserRole } from "@/types";

export const metadata: Metadata = { title: "Dental Surgeon Dashboard" };
export const dynamic = "force-dynamic";

export default async function DentalSurgeonLayout({ children }: { children: React.ReactNode }) {
  const auth = await getServerAuth();
  if (!auth) redirect("/login?redirect=/dentist");
  if (auth.role === UserRole.ADMIN) redirect("/admin");
  if (auth.role !== UserRole.DENTIST) redirect("/");

  const navItems = [
    { href: "/dentist", label: "Overview", icon: "▦" },
    { href: "/dentist/appointments", label: "Appointments", icon: "▣" },
    { href: "/dentist/patients", label: "Patients", icon: "♙" },
    { href: "/dentist/schedule", label: "Schedule", icon: "◷" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden w-64 shrink-0 flex-col bg-slate-900 text-slate-300 md:flex">
        <div className="border-b border-slate-700 p-6">
          <p className="text-lg font-bold text-white">EasyDentalSolution</p>
          <p className="mt-0.5 text-xs text-slate-400">Dental Surgeon Panel</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-slate-700 hover:text-white">
              <span aria-hidden>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-700 p-4">
          <Link href="/" className="text-xs text-slate-400 hover:text-white">← Back to site</Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-semibold text-slate-900">Dental Surgeon Dashboard</h1>
              <p className="text-xs text-slate-500">Manage patients, appointments, and availability</p>
            </div>
            <span className="hidden text-sm text-slate-500 sm:block">{auth.email}</span>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto md:hidden">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700">{item.label}</Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
