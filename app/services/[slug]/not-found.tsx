"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ServiceNotFound() {
  const { locale } = useLanguage();

  const ui =
    locale === "bn"
      ? {
          title: "সেবা পাওয়া যায়নি",
          desc: "আপনি যে সেবাটি খুঁজছেন সেটি পাওয়া যায়নি বা স্থানান্তর করা হয়েছে।",
          back: "সেবাসমূহে ফিরে যান",
          book: "অ্যাপয়েন্টমেন্ট বুক করুন",
        }
      : {
          title: "Service not found",
          desc: "The service you are looking for does not exist or may have been moved.",
          back: "Back to Services",
          book: "Book Appointment",
        };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-6xl mb-4">🦷</p>
      <h1 className="text-3xl font-bold text-slate-900 mb-3">{ui.title}</h1>
      <p className="text-slate-600 mb-8">{ui.desc}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link href="/services">
          <Button>{ui.back}</Button>
        </Link>
        <Link href="/book-appointment">
          <Button variant="outline">{ui.book}</Button>
        </Link>
      </div>
    </div>
  );
}
