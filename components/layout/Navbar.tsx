"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavUser {
  name: string;
  role: string;
}

interface NavbarProps {
  user?: NavUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<NavUser | null>(user ?? null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { t, locale, toggleLanguage } = useLanguage();

  useEffect(() => {
    if (user) return;

    let mounted = true;

    fetch("/api/auth/me")
      .then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
      })
      .then((data) => {
        if (!mounted || !data) return;
        setCurrentUser({
          name: data.name || data.email?.split("@")[0] || "User",
          role: data.role || "patient",
        });
      })
      .catch(() => {
        // noop
      });

    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/dentists");
    router.prefetch("/book-appointment");
    if (currentUser) router.prefetch("/appointments");
    if (currentUser?.role === "admin") router.prefetch("/admin");
    if (currentUser?.role === "dentist") router.prefetch("/dentist");
  }, [router, currentUser]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-sky-600 text-xl"
          >
            <span className="text-2xl">🦷</span>
            <span>{t.nav.brand}</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/dentists"
              className="px-3 py-2 text-sm text-slate-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
            >
              {t.nav.dentists}
            </Link>
            <Link
              href="/book-appointment"
              className="px-3 py-2 text-sm text-slate-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
            >
              {t.nav.bookAppointment}
            </Link>
            {currentUser && (
              <Link
                href="/appointments"
                className="px-3 py-2 text-sm text-slate-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
              >
                {t.nav.myAppointments}
              </Link>
            )}
            {currentUser?.role === "admin" && (
              <Link
                href="/admin"
                className="px-3 py-2 text-sm text-slate-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
              >
                {t.nav.admin}
              </Link>
            )}
            {currentUser?.role === "dentist" && (
              <Link
                href="/dentist"
                className="px-3 py-2 text-sm text-slate-600 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-colors"
              >
                Dentist Dashboard
              </Link>
            )}
          </div>

          {/* Auth buttons + language switcher */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              aria-label="Switch language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:border-sky-400 hover:bg-sky-50 transition-colors text-sm font-medium text-slate-700"
            >
              <span className="text-base">{locale === "en" ? "🇧🇩" : "🇺🇸"}</span>
              <span>{locale === "en" ? "বাংলা" : "English"}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600">
                  {t.nav.hello},{" "}
                  <strong>{currentUser.name.split(" ")[0]}</strong>
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  loading={loggingOut}
                >
                  {t.nav.logout}
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t.nav.register}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          <Link
            href="/dentists"
            className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.dentists}
          </Link>
          <Link
            href="/book-appointment"
            className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
            onClick={() => setMenuOpen(false)}
          >
            {t.nav.bookAppointment}
          </Link>
          {currentUser && (
            <Link
              href="/appointments"
              className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.myAppointments}
            </Link>
          )}
          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.adminDashboard}
            </Link>
          )}
          {currentUser?.role === "dentist" && (
            <Link
              href="/dentist"
              className="block px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
              onClick={() => setMenuOpen(false)}
            >
              Dentist Dashboard
            </Link>
          )}
          {/* Mobile language switcher */}
          <button
            onClick={() => {
              toggleLanguage();
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-sky-50"
          >
            <span>{locale === "en" ? "🇧🇩" : "🇺🇸"}</span>
            <span>{locale === "en" ? "বাংলায় দেখুন" : "View in English"}</span>
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                loading={loggingOut}
                className="w-full"
              >
                {t.nav.logout}
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    {t.nav.login}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    {t.nav.register}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
