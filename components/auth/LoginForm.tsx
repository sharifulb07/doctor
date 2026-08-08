"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserRole } from "@/types";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const { t, locale } = useLanguage();
  const l = t.login;
  const initialRole =
    searchParams.get("role") === UserRole.ADMIN
      ? UserRole.ADMIN
      : searchParams.get("role") === UserRole.DENTIST
        ? UserRole.DENTIST
        : UserRole.PATIENT;
  const [form, setForm] = useState({
    role: initialRole,
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const registered = searchParams.get("registered") === "1";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const [k, v] of Object.entries(data.errors)) {
            flat[k] = (v as string[])[0];
          }
          setErrors(flat);
        } else {
          setServerError(data.message || l.loginFailed);
        }
        return;
      }

      const role = data.data?.user?.role;
      const redirectTo = searchParams.get("redirect");
      const isSafeInternalRedirect =
        !!redirectTo &&
        redirectTo.startsWith("/") &&
        !redirectTo.startsWith("//");

      const targetRoute =
        role === "admin"
          ? "/admin"
          : role === "dentist"
            ? "/dentist"
            : isSafeInternalRedirect
              ? redirectTo
              : "/appointments";

      // Force a full navigation so middleware sees fresh auth cookie immediately.
      window.location.assign(targetRoute);
      return;
    } catch {
      setServerError(l.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-1 grid grid-cols-3 gap-1">
        {[
          { value: UserRole.PATIENT, label: "Patient" },
          { value: UserRole.DENTIST, label: "Dentist" },
          { value: UserRole.ADMIN, label: "Admin" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setForm((prev) => ({ ...prev, role: option.value }))}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              form.role === option.value
                ? "bg-white text-sky-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {registered && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">
          Registration successful. Please sign in with your selected role.
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Input
        label={locale === "bn" ? "ইমেইল বা মোবাইল" : "Email or mobile"}
        name="email"
        type="text"
        autoComplete="username"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="you@example.com / +880…"
      />

      <Input
        label={l.password}
        name="password"
        type="password"
        autoComplete="current-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
        placeholder="••••••••"
      />

      <div className="text-right">
        <Link
          href="/forgot-password"
          className="text-sm text-sky-600 hover:underline"
        >
          {locale === "bn" ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {l.signIn}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {l.noAccount}{" "}
        <Link
          href="/register"
          className="text-sky-600 font-medium hover:underline"
        >
          {l.createOne}
        </Link>
      </p>
    </form>
  );
}
