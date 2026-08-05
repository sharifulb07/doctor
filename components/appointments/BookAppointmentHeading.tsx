"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function BookAppointmentHeading() {
  const { t } = useLanguage();
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900">
        {t.bookAppointment.title}
      </h1>
      <p className="text-slate-500 mt-2">{t.bookAppointment.subtitle}</p>
    </div>
  );
}
