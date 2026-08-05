"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const r = t.register;
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setServerError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
      };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
          setServerError(data.message || r.registrationFailed);
        }
        return;
      }

      router.push(`/login?registered=1&role=patient`);
      router.refresh();
    } catch {
      setServerError(r.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <Input
        label={r.fullName}
        name="name"
        type="text"
        autoComplete="name"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Jane Smith"
      />
      <Input
        label={r.email}
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="you@example.com"
      />
      <Input
        label={r.password}
        name="password"
        type="password"
        autoComplete="new-password"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        required
        placeholder={r.passwordPlaceholder}
        hint={r.passwordHint}
      />
      <Input
        label={r.confirmPassword}
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        required
        placeholder="••••••••"
      />
      <Input
        label={r.phone}
        name="phone"
        type="tel"
        autoComplete="tel"
        value={form.phone}
        onChange={handleChange}
        error={errors.phone}
        placeholder="+1 555 123 4567"
      />
      <Input
        label={r.dateOfBirth}
        name="dateOfBirth"
        type="date"
        autoComplete="bday"
        value={form.dateOfBirth}
        onChange={handleChange}
        error={errors.dateOfBirth}
      />

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {r.createAccount}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {r.alreadyHave}{" "}
        <Link
          href="/login"
          className="text-sky-600 font-medium hover:underline"
        >
          {r.signIn}
        </Link>
      </p>
    </form>
  );
}
