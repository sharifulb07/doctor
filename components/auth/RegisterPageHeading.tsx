"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function RegisterPageHeading() {
  const { t } = useLanguage();
  return (
    <div className="text-center mb-8">
      <div className="text-5xl mb-3">🦷</div>
      <h1 className="text-2xl font-bold text-slate-900">{t.register.title}</h1>
      <p className="text-slate-500 mt-1">{t.register.subtitle}</p>
    </div>
  );
}
