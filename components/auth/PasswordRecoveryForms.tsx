"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export function ForgotPasswordForm() {
  const { locale } = useLanguage();
  const bn = locale === "bn";
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setMessage(""); setError("");
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      if (!response.ok) { setError(data.errors?.email?.[0] || data.message || (bn ? "অনুরোধ পাঠানো যায়নি।" : "Could not send the request.")); return; }
      setMessage(bn ? "অ্যাকাউন্টটি থাকলে পাসওয়ার্ড পরিবর্তনের নির্দেশনা পাঠানো হয়েছে।" : data.message);
    } catch { setError(bn ? "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।" : "Network error. Please try again."); }
    finally { setLoading(false); }
  }

  return <form onSubmit={submit} className="space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-900">{bn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot your password?"}</h1><p className="mt-2 text-sm text-slate-500">{bn ? "আপনার ইমেইল ঠিকানা লিখুন।" : "Enter your email address."}</p></div>
    {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Input label={bn ? "ইমেইল ঠিকানা" : "Email address"} name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
    <Button type="submit" className="w-full" size="lg" loading={loading}>{bn ? "রিসেট লিংক পাঠান" : "Send reset link"}</Button>
    <Link href="/login" className="block text-center text-sm text-sky-600 hover:underline">{bn ? "লগইনে ফিরে যান" : "Back to login"}</Link>
  </form>;
}

export function ResetPasswordForm() {
  const { locale } = useLanguage();
  const bn = locale === "bn";
  const token = useSearchParams().get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    if (password !== confirmPassword) { setError(bn ? "পাসওয়ার্ড দুটি মিলছে না।" : "Passwords do not match."); return; }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) });
      const data = await response.json();
      if (!response.ok) { setError(data.errors?.password?.[0] || data.message || (bn ? "পাসওয়ার্ড পরিবর্তন করা যায়নি।" : "Could not reset password.")); return; }
      setSuccess(true);
    } catch { setError(bn ? "নেটওয়ার্ক ত্রুটি। আবার চেষ্টা করুন।" : "Network error. Please try again."); }
    finally { setLoading(false); }
  }

  if (!token) return <p className="text-sm text-red-700">{bn ? "রিসেট লিংকটি সঠিক নয়।" : "This reset link is invalid."}</p>;
  if (success) return <div className="text-center"><h1 className="text-2xl font-bold text-slate-900">{bn ? "পাসওয়ার্ড পরিবর্তন হয়েছে" : "Password reset complete"}</h1><p className="mt-2 text-sm text-slate-500">{bn ? "এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।" : "You can now sign in with your new password."}</p><Link href="/login" className="mt-5 inline-block text-sky-600 hover:underline">{bn ? "লগইন করুন" : "Sign in"}</Link></div>;

  return <form onSubmit={submit} className="space-y-5">
    <div><h1 className="text-2xl font-bold text-slate-900">{bn ? "নতুন পাসওয়ার্ড তৈরি করুন" : "Create a new password"}</h1><p className="mt-2 text-sm text-slate-500">{bn ? "কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।" : "Use at least 8 characters with uppercase, lowercase, number, and symbol."}</p></div>
    {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <Input label={bn ? "নতুন পাসওয়ার্ড" : "New password"} name="password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
    <Input label={bn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm password"} name="confirmPassword" type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
    <Button type="submit" className="w-full" size="lg" loading={loading}>{bn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Reset password"}</Button>
  </form>;
}
