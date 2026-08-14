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
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const flat: Record<string, string> = {};
          for (const [key, value] of Object.entries(data.errors)) {
            flat[key] = (value as string[])[0];
          }
          setErrors(flat);
        } else {
          setServerError(data.message || r.registrationFailed);
        }
        return;
      }

      router.push("/login?registered=1&role=patient");
    } catch {
      setServerError(r.networkError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <Input
        label="Email or mobile number"
        name="identifier"
        type="text"
        autoComplete="username"
        value={form.identifier}
        onChange={handleChange}
        error={errors.identifier}
        required
        placeholder="you@example.com or +880 1XXX XXXXXX"
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

      <Button type="submit" className="w-full" size="lg" loading={loading}>
        {r.createAccount}
      </Button>

      <p className="text-center text-sm text-slate-600">
        {r.alreadyHave}{" "}
        <Link href="/login" className="font-medium text-sky-600 hover:underline">
          {r.signIn}
        </Link>
      </p>
    </form>
  );
}
