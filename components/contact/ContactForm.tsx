"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactForm() {
  const { locale } = useLanguage();
  const bn = locale === "bn";
  const [form, setForm] = useState({ name: "", email: "", question: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus("idle");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(
            Object.fromEntries(
              Object.entries(data.errors).map(([key, values]) => [
                key,
                (values as string[])[0],
              ]),
            ),
          );
        }
        setStatus("error");
        setMessage(
          data.message ||
            (bn
              ? "বার্তাটি পাঠানো যায়নি। আবার চেষ্টা করুন।"
              : "Your message could not be sent. Please try again."),
        );
        return;
      }

      setForm({ name: "", email: "", question: "" });
      setErrors({});
      setStatus("success");
      setMessage(
        bn
          ? "আপনার প্রশ্ন সফলভাবে পাঠানো হয়েছে। আমরা শিগগিরই উত্তর দেব।"
          : "Your question was sent successfully. We will reply soon.",
      );
    } catch {
      setStatus("error");
      setMessage(
        bn
          ? "নেটওয়ার্ক সমস্যা হয়েছে। আবার চেষ্টা করুন।"
          : "A network error occurred. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {status !== "idle" && (
        <div
          role={status === "error" ? "alert" : "status"}
          className={`rounded-xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          }`}
        >
          {message}
        </div>
      )}

      <Input
        label={bn ? "আপনার নাম" : "Your name"}
        name="name"
        autoComplete="name"
        value={form.name}
        onChange={updateField}
        error={errors.name}
        minLength={2}
        maxLength={80}
        required
      />
      <Input
        label={bn ? "ইমেইল ঠিকানা" : "Email address"}
        name="email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={updateField}
        error={errors.email}
        maxLength={254}
        required
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-question" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {bn ? "আপনার প্রশ্ন" : "Your question"}
          <span className="ml-0.5 text-red-500">*</span>
        </label>
        <textarea
          id="contact-question"
          name="question"
          rows={7}
          minLength={10}
          maxLength={3000}
          value={form.question}
          onChange={updateField}
          aria-describedby={errors.question ? "contact-question-error" : undefined}
          className={`w-full resize-y rounded-xl border bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-950 dark:text-white ${errors.question ? "border-red-400" : "border-slate-300 dark:border-slate-700"}`}
          placeholder={
            bn
              ? "আমাদের কাছে কী জানতে চান তা লিখুন…"
              : "Tell us what you would like to know…"
          }
          required
        />
        {errors.question && (
          <p id="contact-question-error" role="alert" className="text-xs text-red-500">
            {errors.question}
          </p>
        )}
        <p className="text-right text-xs text-slate-500">
          {form.question.length}/3000
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={submitting}>
        {submitting
          ? bn
            ? "পাঠানো হচ্ছে…"
            : "Sending…"
          : bn
            ? "প্রশ্ন পাঠান"
            : "Send question"}
      </Button>
    </form>
  );
}
